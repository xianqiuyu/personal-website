<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'

type Direction = 'up' | 'down' | 'left' | 'right'

interface Tank {
  x: number
  y: number
  size: number
  speed: number
  dir: Direction
  hp: number
}

interface Bullet {
  x: number
  y: number
  size: number
  speed: number
  dir: Direction
  owner: 'player' | 'enemy'
  alive: boolean
}

interface Enemy extends Tank {
  aiCooldown: number
}

interface Wall {
  x: number
  y: number
  w: number
  h: number
  hp: number
}

const gameWidth = 800
const gameHeight = 600

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const running = ref(false)

const state = reactive({
  score: 0,
  lives: 3,
  level: 1,
  message: '按空格开始游戏，WASD 或 方向键控制坦克，J 或 空格射击',
})

const keys = reactive(new Set<string>())

const player = reactive<Tank>({
  x: gameWidth / 2 - 20,
  y: gameHeight - 80,
  size: 40,
  speed: 3,
  dir: 'up',
  hp: 3,
})

const enemies = reactive<Enemy[]>([])
const bullets = reactive<Bullet[]>([])
const walls = reactive<Wall[]>([])

let lastTime = 0
let animationId = 0

function resetLevel() {
  enemies.splice(0, enemies.length)
  bullets.splice(0, bullets.length)
  walls.splice(0, walls.length)

  player.x = gameWidth / 2 - player.size / 2
  player.y = gameHeight - 80
  player.dir = 'up'
  player.hp = 3

  // 简单关卡：顶部一排敌人 + 中间一些墙
  const enemyCount = 5 + state.level
  for (let i = 0; i < enemyCount; i++) {
    enemies.push({
      x: 60 + i * 120,
      y: 60,
      size: 40,
      speed: 1 + state.level * 0.2,
      dir: 'down',
      hp: 2 + state.level,
      aiCooldown: 0,
    })
  }

  for (let i = 0; i < 4; i++) {
    walls.push({
      x: 150 + i * 120,
      y: gameHeight / 2,
      w: 60,
      h: 30,
      hp: 4,
    })
  }
}

function startGame() {
  if (running.value) return
  running.value = true
  state.message = ''
  resetLevel()
  lastTime = performance.now()
  animationId = requestAnimationFrame(loop)
}

function stopGame(msg: string) {
  running.value = false
  cancelAnimationFrame(animationId)
  state.message = msg + ' 按空格重新开始'
}

function spawnBullet(owner: 'player' | 'enemy', x: number, y: number, dir: Direction) {
  bullets.push({
    x,
    y,
    size: 8,
    speed: owner === 'player' ? 6 : 4,
    dir,
    owner,
    alive: true,
  })
}

function handlePlayerInput() {
  if (!running.value) return
  let moved = false

  const up = keys.has('ArrowUp') || keys.has('KeyW')
  const down = keys.has('ArrowDown') || keys.has('KeyS')
  const left = keys.has('ArrowLeft') || keys.has('KeyA')
  const right = keys.has('ArrowRight') || keys.has('KeyD')

  if (up) {
    player.y -= player.speed
    player.dir = 'up'
    moved = true
  } else if (down) {
    player.y += player.speed
    player.dir = 'down'
    moved = true
  }

  if (left) {
    player.x -= player.speed
    player.dir = 'left'
    moved = true
  } else if (right) {
    player.x += player.speed
    player.dir = 'right'
    moved = true
  }

  // 边界限制
  player.x = Math.max(0, Math.min(gameWidth - player.size, player.x))
  player.y = Math.max(0, Math.min(gameHeight - player.size, player.y))

  // 简单防止坦克穿墙：如果与墙重叠，回退一点
  if (moved) {
    for (const w of walls) {
      if (rectIntersect(player.x, player.y, player.size, player.size, w.x, w.y, w.w, w.h)) {
        if (player.dir === 'up') player.y += player.speed
        if (player.dir === 'down') player.y -= player.speed
        if (player.dir === 'left') player.x += player.speed
        if (player.dir === 'right') player.x -= player.speed
      }
    }
  }
}

function handleShooting(key: string) {
  if (!running.value && key === 'Space') {
    startGame()
    return
  }
  if (!running.value) return

  if (key === 'Space' || key === 'KeyJ') {
    let bx = player.x + player.size / 2
    let by = player.y + player.size / 2
    const offset = player.size / 2 + 4

    if (player.dir === 'up') by -= offset
    if (player.dir === 'down') by += offset
    if (player.dir === 'left') bx -= offset
    if (player.dir === 'right') bx += offset

    spawnBullet('player', bx, by, player.dir)
  }
}

function updateEnemies(dt: number) {
  for (const e of enemies) {
    // 简单 AI：向玩家大致移动
    const dx = player.x - e.x
    const dy = player.y - e.y
    if (Math.abs(dx) > Math.abs(dy)) {
      e.x += Math.sign(dx) * e.speed * dt * 60
      e.dir = dx > 0 ? 'right' : 'left'
    } else {
      e.y += Math.sign(dy) * e.speed * dt * 60
      e.dir = dy > 0 ? 'down' : 'up'
    }

    // 边界约束
    e.x = Math.max(0, Math.min(gameWidth - e.size, e.x))
    e.y = Math.max(0, Math.min(gameHeight - e.size, e.y))

    // 简单墙体阻挡
    for (const w of walls) {
      if (rectIntersect(e.x, e.y, e.size, e.size, w.x, w.y, w.w, w.h)) {
        if (e.dir === 'up') e.y += e.speed * dt * 60
        if (e.dir === 'down') e.y -= e.speed * dt * 60
        if (e.dir === 'left') e.x += e.speed * dt * 60
        if (e.dir === 'right') e.x -= e.speed * dt * 60
      }
    }

    // 射击冷却 & 射击
    e.aiCooldown -= dt
    const distanceToPlayer = Math.hypot(dx, dy)
    if (e.aiCooldown <= 0 && distanceToPlayer < 400) {
      e.aiCooldown = 1.2 + Math.random()

      // 朝玩家大致方向射击（只用主方向）
      let dir: Direction
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? 'right' : 'left'
      } else {
        dir = dy > 0 ? 'down' : 'up'
      }

      const bx = e.x + e.size / 2
      const by = e.y + e.size / 2
      spawnBullet('enemy', bx, by, dir)
    }
  }
}

function updateBullets(dt: number) {
  for (const b of bullets) {
    if (!b.alive) continue
    const distance = b.speed * dt * 60
    if (b.dir === 'up') b.y -= distance
    if (b.dir === 'down') b.y += distance
    if (b.dir === 'left') b.x -= distance
    if (b.dir === 'right') b.x += distance

    if (b.x < 0 || b.x > gameWidth || b.y < 0 || b.y > gameHeight) {
      b.alive = false
    }
  }

  // 子弹碰撞：墙体
  for (const b of bullets) {
    if (!b.alive) continue
    for (const w of walls) {
      if (w.hp <= 0) continue
      if (rectIntersect(b.x - b.size / 2, b.y - b.size / 2, b.size, b.size, w.x, w.y, w.w, w.h)) {
        w.hp -= 1
        b.alive = false
        break
      }
    }
  }

  // 子弹碰敌人
  for (const b of bullets) {
    if (!b.alive || b.owner !== 'player') continue
    for (const e of enemies) {
      if (e.hp <= 0) continue
      if (rectIntersect(b.x - b.size / 2, b.y - b.size / 2, b.size, b.size, e.x, e.y, e.size, e.size)) {
        e.hp -= 1
        b.alive = false
        if (e.hp <= 0) {
          state.score += 100
        }
        break
      }
    }
  }

  // 子弹碰玩家
  for (const b of bullets) {
    if (!b.alive || b.owner !== 'enemy') continue
    if (rectIntersect(b.x - b.size / 2, b.y - b.size / 2, b.size, b.size, player.x, player.y, player.size, player.size)) {
      b.alive = false
      player.hp -= 1
      if (player.hp <= 0) {
        state.lives -= 1
        if (state.lives <= 0) {
          stopGame('游戏结束')
        } else {
          resetLevel()
        }
      }
    }
  }

  // 清理死亡子弹 & 墙体 & 敌人
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (!bullets[i].alive) bullets.splice(i, 1)
  }
  for (let i = walls.length - 1; i >= 0; i--) {
    if (walls[i].hp <= 0) walls.splice(i, 1)
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].hp <= 0) enemies.splice(i, 1)
  }
}

function rectIntersect(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

function update(dt: number) {
  if (!running.value) return
  handlePlayerInput()
  updateEnemies(dt)
  updateBullets(dt)

  if (enemies.length === 0) {
    state.level += 1
    state.message = '恭喜通关，进入下一关！'
    resetLevel()
  }
}

function drawTank(t: Tank, color: string) {
  const c = ctx.value
  if (!c) return
  c.fillStyle = color
  c.fillRect(t.x, t.y, t.size, t.size)

  // 炮管
  c.fillStyle = '#eee'
  const gunW = 8
  const gunL = t.size / 2 + 6
  const cx = t.x + t.size / 2
  const cy = t.y + t.size / 2
  if (t.dir === 'up') {
    c.fillRect(cx - gunW / 2, cy - gunL, gunW, gunL)
  } else if (t.dir === 'down') {
    c.fillRect(cx - gunW / 2, cy, gunW, gunL)
  } else if (t.dir === 'left') {
    c.fillRect(cx - gunL, cy - gunW / 2, gunL, gunW)
  } else if (t.dir === 'right') {
    c.fillRect(cx, cy - gunW / 2, gunL, gunW)
  }
}

function draw() {
  const c = ctx.value
  const canvas = canvasRef.value
  if (!c || !canvas) return

  // 背景
  c.fillStyle = '#1a1a1a'
  c.fillRect(0, 0, canvas.width, canvas.height)

  // 网格线，便于观察
  c.strokeStyle = '#333'
  c.lineWidth = 1
  for (let x = 0; x < canvas.width; x += 40) {
    c.beginPath()
    c.moveTo(x, 0)
    c.lineTo(x, canvas.height)
    c.stroke()
  }
  for (let y = 0; y < canvas.height; y += 40) {
    c.beginPath()
    c.moveTo(0, y)
    c.lineTo(canvas.width, y)
    c.stroke()
  }

  // 墙
  for (const w of walls) {
    c.fillStyle = '#8b5a2b'
    c.fillRect(w.x, w.y, w.w, w.h)
  }

  // 敌人
  for (const e of enemies) {
    drawTank(e, '#e74c3c')
  }

  // 玩家
  drawTank(player, '#2ecc71')

  // 子弹
  for (const b of bullets) {
    c.fillStyle = b.owner === 'player' ? '#f1c40f' : '#ff9ff3'
    c.beginPath()
    c.arc(b.x, b.y, b.size / 2, 0, Math.PI * 2)
    c.fill()
  }

  // HUD
  c.fillStyle = '#ffffff'
  c.font = '16px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  c.fillText(`得分: ${state.score}`, 16, 24)
  c.fillText(`生命: ${state.lives}`, 16, 48)
  c.fillText(`关卡: ${state.level}`, 16, 72)

  if (!running.value && state.message) {
    c.fillStyle = 'rgba(0,0,0,0.5)'
    c.fillRect(0, canvas.height / 2 - 60, canvas.width, 120)
    c.fillStyle = '#fff'
    c.textAlign = 'center'
    c.font = '20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    c.fillText(state.message, canvas.width / 2, canvas.height / 2)
    c.textAlign = 'left'
  }
}

function loop(timestamp: number) {
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp
  update(dt)
  draw()
  if (running.value) {
    animationId = requestAnimationFrame(loop)
  }
}

function onKeyDown(e: KeyboardEvent) {
  keys.add(e.code)
  if (e.code === 'Space') {
    e.preventDefault()
  }
  handleShooting(e.code)
}

function onKeyUp(e: KeyboardEvent) {
  keys.delete(e.code)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = gameWidth
  canvas.height = gameHeight
  const context = canvas.getContext('2d')
  if (!context) return
  ctx.value = context
  draw()

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <div class="tank-page">
    <div class="top-bar">
      <h2>坦克大战</h2>
      <p>WASD / 方向键移动，J 或 空格射击</p>
    </div>
    <div class="game-wrapper">
      <canvas ref="canvasRef" class="game-canvas"></canvas>
    </div>
  </div>
</template>

<style scoped>
.tank-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  color: #f5f5f5;
}

.top-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.top-bar h2 {
  margin: 0;
  font-size: 1.4rem;
}

.top-bar p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.game-wrapper {
  background: radial-gradient(circle at top, #303f9f, #121212);
  border-radius: 16px;
  padding: 1rem;
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.35),
    0 10px 10px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.game-canvas {
  background: #000;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.15);
}

@media (max-width: 900px) {
  .game-wrapper {
    padding: 0.5rem;
  }

  .game-canvas {
    transform: scale(0.8);
    transform-origin: top left;
  }
}
</style>

