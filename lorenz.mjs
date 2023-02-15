// GLOBALS:

var canvasEl  = document.querySelector('canvas')
var context   = canvasEl.getContext('2d', { alpha: false })


canvasEl.width  = innerWidth
canvasEl.height = innerHeight

var midx = canvasEl.width  / 2
var midy = canvasEl.height / 2

// COLOUR

class HSLObject
{
  constructor(hue, sat, light)
  {
    this.hue    = hue
    this.sat    = sat
    this.light  = light
    this.makeHSL()
  }

  makeHSL()
  {
    this.hue   = this.hue   % 361
    this.sat   = this.sat   % 101
    this.light = this.light % 101
    this.hsl = `hsl(${this.hue}, ${this.sat}%, ${this.light}%)`
  }

  editHue(change)
  {
    this.hue += change
    this.makeHSL()
  }

  editSat(change)
  {
    this.sat += change
    this.makeHSL()
  }

  editLight(change)
  {
    this.light += change
    this.makeHSL()
  }

  setLight(value)
  {
    this.light = value
    this.makeHSL()
  }
}

class RGBObject
{
  constructor(red, green, blue)
  {
    this.rgbMax = 256
    this.red   = red
    this.green = green
    this.blue  = blue
    this.makeRGB()
  }

  makeRGB()
  {
    this.red   = this.red   % this.rgbMax
    this.green = this.green % this.rgbMax
    this.blue  = this.blue  % this.rgbMax
    this.rgb = `rgb(${this.red}, ${this.green}, ${this.blue})`
  }

  editRed(change)
  {
    this.red += change
    this.makeRGB()
  }

  editGreen(change)
  {
    this.green += change
    this.makeRGB()
  }

  editBlue(change)
  {
    this.blue += change
    this.makeRGB()
  }

  editAll(change)
  {
    this.red += change
    this.green += change
    this.blue += change
    this.makeRGB()
  }
}

function randomHSL(hue, sat, light)
{
  if (typeof hue === 'undefined')
  {
    hue = Math.random() * 360
  }

  if (typeof sat === 'undefined')
  {
    sat = Math.random() * 100
  }

  if (typeof light === 'undefined')
  {
    light = Math.random() * 100
  }


  const randomHSLObject = new HSLObject(hue, sat, light)
  return randomHSLObject
}

// MAIN:

class Canvas
{
    constructor(context, canvas, colour)
    {
      this.context    = context
      this.canvas     = canvas
      this.colour     = colour
      this.baseColour = colour
      this.update = function()
        {
            this.context.fillStyle = this.colour.hsl
            this.context.clearRect(0, 0, innerWidth, innerHeight)
        }
    }

    initialise()
    {
        this.context.fillStyle = this.colour.hsl
        this.context.fillRect(0, 0, innerWidth, innerHeight)
    }
}

var canvasColour = new HSLObject(0, 10, 10)
let canvas  = new Canvas(context, canvasEl, canvasColour)
context.lineWidth = 2

let speed_modifier = 1 / 2
class Stroke
{
    constructor(begin_x, begin_y, end_x, end_y, z, alpha)
    {
        this.begin_x = Math.floor(begin_x * size_modifier_x + midx)
        this.begin_y = Math.floor(begin_y * size_modifier_y + midy)
        this.end_x = Math.floor(end_x * size_modifier_x + midx)
        this.end_y = Math.floor(end_y * size_modifier_y + midy)
        this.z = z

        let hue = Math.abs(this.end_x / 10 + total_ticks)
        let sat = Math.abs(this.end_y / 10)
        this.colour = "hsl(" + hue + "," + sat + "%," + ((this.z) * 20 +50) + "%)"

        this.new = true

        this.alpha = alpha
        this.life = 75
        this.minAlpha = this.alpha / this.life
    }

    draw()
    {
        this.new = false

        this.alpha -= this.minAlpha
        context.globalAlpha = this.alpha

        context.beginPath()
        context.moveTo(this.begin_x, this.begin_y)
        context.lineTo(this.end_x, this.end_y)

        context.strokeStyle = this.colour
        context.stroke()
    }

    update()
    {
        this.draw()
        // if (this.alpha > this.minAlpha) { this.alpha -= this.minAlpha }
        // context.globalAlpha = this.alpha
    }
}

let attractor = function(x, y, z) {}
class Particle
{
    constructor(x, y, radius, colour, velocity)
    {
        this.x = x
        this.y = y
        this.z = 1.82
        this.alpha = 1
        this.radius = radius
        this.base_radius = radius
        this.colour = colour
        this.velocity = velocity
        this.attractor = attractor
    }

    draw()
    {
        //context.globalAlpha = this.alpha
        //context.beginPath()

        let old_x = this.x
        let old_y = this.y
        let old_z = this.z

        let xyz = this.attractor(this.x, this.y, this.z)
        this.x = xyz["x"]
        this.y = xyz["y"]
        this.z = xyz["z"]

        strokes.push(new Stroke(old_y, old_z, this.y, this.z, this.x, 1))
        if (show_particles)
        {
            let hue = Math.abs((this.x * size_modifier_x) + midx / 10)
            let sat = Math.abs((this.y * size_modifier_y) + midy / 10)
            context.beginPath()
            context.fillStyle = "hsl(" + 0 + "," + 0 + "%," + 70 + "%)"
            context.arc(Math.floor((this.z * size_modifier_x) + midx), Math.floor((this.y * size_modifier_y) + midy), this.radius, 0, Math.PI * 2)
            context.fill()
        }

    }
}

let num_particles = 90
let particle_radius = 2
let particles = []
let strokes = []
let state = 1
let show_particles = false
function init()
{
    switch(state)
    {
        case 0:
            speed_modifier = 1 / 2
            size_modifier_x = 50
            size_modifier_y = 28
            attractor = function(x, y, z)
            {
                framerate = speed_modifier //*  1 / Math.max(60, fps)
                x += (x + (y - x) * 10) * framerate
                y += (x * (28 - z) - y) * framerate
                z += (x * y - (8 / 3) * z) * framerate
                return {"x": x, "y": y, "z": z}
            }
            break

        case 1:
            speed_modifier = 2 / 60
            size_modifier_x = 300
            size_modifier_y = 300
            attractor = function(x, y, z)
            {
                framerate = speed_modifier// *  1 / Math.max(60, fps)
                let alpha = 0.95
                let beta = 0.7
                let gamma = 0.65
                let delta = 3.5
                let epsilon = 0.25
                let zeta = 0.1

                let temp_x = x

                let sign = 1
                if (y < 0)
                {
                    sign = -1
                }
                let temp_y = y + Math.random() * 0.001 * sign
                let temp_z = z

                temp_x += (((z - beta) * x) - (delta * y)) * framerate
                temp_y += ((delta * x) + (z - beta) * y) * framerate

                let z1 = (gamma + (alpha * z) - Math.pow(z, 3.0) / 3.0 - (Math.pow(x, 2.0) + Math.pow(y, 2.0)))
                let z2 = (1 + epsilon * z) + (zeta * z * Math.pow(x, 3.0))

                temp_z += z1 * z2 * framerate

                x = temp_x
                y = temp_y + Math.random() * 0.0001 * sign
                z = temp_z
                return {"x": x, "y": y, "z": z}
            }
            break
    }

    j = num_particles
    const interval = setInterval(() =>
    {
        let middle = 0
        let particle = new Particle(0, Math.random()-0.5, particle_radius, randomHSL(), {x: 0.5, y: 0.5})
        particles.push(particle)
        if (j > 0) { j -= 1 }
        if (j == 0) { clearInterval(interval) }
    }, 75)

    // for (var i = 1; i < num_particles; i += 1)
    // {
    //     let middle = 1.5
    //     let particle = new Particle(-middle + i / 25, -middle + i / 25, particle_radius, randomHSL(), {x: 0.5, y: 0.5})
    //     particles.push(particle)
    // }
    canvas.initialise()
    animate()
}

let total_ticks = 0
let ticks = 0
let fps = 60
let lastFps = 0
function animate()
{
    animationId = requestAnimationFrame(animate)

    canvas.update()

    strokes.forEach((stroke, index) =>
    {
        if (stroke.alpha < stroke.minAlpha)
        {
            strokes.splice(index, 1)
        } else {
            if (stroke.new)
            {
                stroke.draw()
            } else {
                stroke.update()
            }
            
        }
    })

    particles.forEach(particle =>
    {
        particle.draw()
    })

    var now = Date.now()
    if (now - lastFps >= 1000) {
        lastFps = now
        fps = ticks
        ticks = 0
        document.getElementById("framerate").innerHTML = fps
    }
    total_ticks++
    ticks++
}

addEventListener("resize", (event) =>
{
    canvasEl.width  = innerWidth
    canvasEl.height = innerHeight

    midx = canvasEl.width  / 2
    midy = canvasEl.height / 2
})

let play = false
addEventListener("click", (event) =>
{
    if (!play)
    {
        play = true
        
        var audio = new Audio('Jeux.mp3');
        //audio.play();

        gsap.to(document.getElementById("start"),
        {
            transform: `translate(0, -140%)`,
            duration: 0.8
        })

        setTimeout(() =>
        { 
            init()
        }, 800)
    }

})

//window.onload = init()
