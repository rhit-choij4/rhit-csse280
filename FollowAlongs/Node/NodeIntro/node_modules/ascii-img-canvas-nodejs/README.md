# ascii-img-canvas-nodejs

## Overview

Convert almost any image into ASCII with NodeJS.

Note: This lib depends on [canvas](https://www.npmjs.com/package/canvas), which has some **very heavy** [compiling](https://www.npmjs.com/package/canvas#compiling) requirements. Please check to see if/how your machine's OS is supported. (I recommend Ubuntu.)

## Install

`npm install ascii-img-canvas-nodejs`

## Usage (lib)

```javascript
const imgToAscii = require('ascii-img-canvas-nodejs')

const opts = {}

const asciiImgHosted = await imgToAscii('http://example.com/image.jpg', opts)
console.log(asciiImgHosted)

const asciiImgLocal = await imgToAscii('images/face.jpg', opts)
console.log(asciiImgLocal)
```

## Options (= `default`)

- .chars = `' .,:;i1tfLCG08@'`
- .invert = `false` (light <==> dark)
- .raw = `false` (format: `[char, [r, g, b, a]]`)
- .htmlColor = `false` *
- .block = `false`  (* .htmlColor)
- .opacity = `false`  (* .htmlColor)

### Dimensions

- .width = `undefined` (or `Number`)
- .height = `undefined` (or `Number`)

If only *one* dimension is specified (as a Number), the other one is auto-calculated to scale (`pixel measurement * ratio`).

If *neither* dimension is specified, `width` is set to `100` and `height` is auto-calculated. (Not recommended)

## Usage (cli)

`npm install -g ascii-img-canvas-nodejs`

`ascii-img {image-path} {options?}`

Eg. `ascii-img "http://url1" --width=100 --height=100`

Eg. `ascii-img "/path/to/local/image.jpg" --width=100 --height=100`

Eg. `ascii-img "/path/to/local/images/folder/" --width=100 --height=100`

- image file names must end with `/\.(jpe?g|png|svg)$/i`
- supports option: `--writeFileWithTag="txt"`

## Usage (HTTP/S)

Server:

`npm install -g ascii-img-canvas-nodejs`

`ascii-img-server <port?||3000> <ip?||'0.0.0.0'>`

Client:

- help:
  - `GET /`
- single image:
  - `GET /img?url=http://url1&{options}`
- multiple images:
  - Note: body content-type of `application/json`
  - `POST /imgs?{options} ; ["url1", ...]`
  - Eg. `POST /imgs?width=100&height=100 ; ["http://url1"]`

## Sample

![cartoon dog](resources/cartoon-dog.jpg)

`$ ascii-img ./resources/cartoon-dog.jpg --width=50 --height=50`

```bash
                           ,,:;ii,
                          ff111111;
                 ,1111i...ft111t111:  .CCCCCCL:
             ,11111111111111111t1.    ;GGCGGGCG:
             .tft;:::fttt1Lt1111i:,   .iti:,,,:,,
                ;tft1tt111t;;,i1111i11;,,,,,,,,,,.
                   if1111111iCi;ii;:,,,,,,,,,,:::.
                   tt11111111,,,:::::,,,,,,,:.
                   :ft111111i:,,i000L:,,,,.
                    iftt111111ti:,:11iii;;.
      .,,             :,i1tffffttt1:,ii;;;;:
    ,:,,                   ,fft1111. .1i;;;;.
   ,:,,:;                  ,tffftfLLf, ,:::
   :t1111;                 iCGGCCLLt1i
    if1111i,:;i1CGGGCL1111111111111;;;,,
     .1ftt1111111111111ff1111tGGGC1;,,,,
        :1111111111111tLf11f1111111;,,:,:;11111;.
        :ft111111111i;iiii;it111111::i1111111111t1
      .1tttfft111111:::::::1t111111tttfft: .1ftf1.
   .1f11111fffft1: .. ..,,it11111i11;,
  ,f1111t1ift1111tt111i   .f1111.
 .ft11:      .,,,;t11111. ,f111,
,f111;            iffff1 .f111i
f111111t:                 tt1111i;.
 .:;;i:                   ,t11111tt:
```
