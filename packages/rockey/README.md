# Rockey

![Rockey tests](https://api.travis-ci.org/tuchk4/rockey.svg?branch=master)

-  <img src="http://i.imgur.com/ULoeOL4.png" height="16"/> [Rockey at Medium](https://medium.com/@valeriy.sorokobatko/forgekit-785eb17a9b50#.bo3ijxdbm)


## Advantages

### Readable css class names

```js
const buttonRule = rule`
  Button {
    padding: 5px;
    border: none;
    background: white;
    color: black;
  }
`;

const primaryButtonRule = rule`
  PrimaryButton {
    color: blue;  
  }
`;

primaryButtonRule.addParent(buttonRule);

primaryButtonRule.getClassList({});

{
  "PrimaryButton": ["PrimaryButton", "Button"]
}
```

Will render components (hash will be generated each time randomly):

```html
<Button class="Button-1fcd">
<Button class="PrimaryButton-ab4c Button-1fcd">
```
