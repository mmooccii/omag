# HTML/CSS/JS

ファイル構成

```
.
├── LICENSE
├── README.md
├── html
│   ├── assets
│   │   ├── css
│   │   │   ├── readme.txt
│   │   │   └── style.css
│   │   ├── images
│   │   │   └── readme.txt
│   │   └── js
│   │       └── readme.txt
│   └── index.html
├── package.json
└── src
    ├── css
    │   └── reset.css
    └── scss
        └── _reset.scss
```

## src/css/reset.css

共通のスタイルシートです。最初に読み込んでおいてください。
サンプルの html/assets/css/style.css の先頭に記述しています。

## src/scss/\_reset.scss

共通のスタイルシートの SCSS 版です。
Sass で作業する場合はこちらを最初に使ってください。

## html/index.html

共通部分を切り抜いた index.html です。

## お願い

### CSS 記述の注意

`html`タグの以下の、変更しないでください。全体のフォントサイズを変更する時は、`body` の方を変更してください。

```css
html {
  font-size: 10px;　/* <-- 変更しないでください。 */
}
```

ページの基本フォントサイズを変更したい場合

```css
body {
  font-size: 1.4rem; /* <-- 14pxになります。 */
}
```

#### CSS/Sass

一応、どちらの方式で作っても問題ありません。
Sass を使うのであれば、media query の'mixin'を用意してありますので、
こちらを使っていただければと思います。

他にも Mixin 用意してありますので、`src/scss/_vars.scss`の中をご覧ください。

```scss
p {
  /* pc サイズ */
  background-color: red;
  /* tablet サイズ */
  @include media("screen", "medium") {
    background-color: blue;
  }
  /* mobile サイズ */
  @include media("screen", "small") {
    background-color: green;
  }
}
```

上を、SCSS 変換すると以下のようになります。

```css
p {
  background-color: red;
}
@media only screen and (max-width: 1199px) and (min-width: 768px) {
  p {
    background-color: blue;
  }
}
@media only screen and (max-width: 767px) {
  p {
    background-color: green;
  }
}
```

モバイルファーストに書く場合は、

```scss
p {
  /* mobile サイズ */
  background-color: green;
  /* tablet サイズ */
  @include media("screen", "medium") {
    background-color: blue;
  }
  /* pc サイズ */
  @include media("screen", "pc") {
    background-color: red;
  }
}
```

これを変換すると、

```css
p {
  background-color: green;
}
@media only screen and (max-width: 1199px) and (min-width: 768px) {
  p {
    background-color: blue;
  }
}
@media only screen and (min-width: 1200) {
  p {
    background-color: red;
  }
}
```

### HTML

共通フッターは、後ほど配布します。従いまして、`footer`タグは利用しないでください。

```html
<footer id="omag_common__footer123456"></footer>
```
