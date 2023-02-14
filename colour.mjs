export class HSLObject
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

export class RGBObject
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

export function randomHSL(hue, sat, light)
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