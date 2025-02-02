<p align="center"><img align="center" width="280" src="./.github/text-logo.svg#gh-dark-mode-only"/></p>
<p align="center"><img align="center" width="280" src="./.github/text-logo-light.svg#gh-light-mode-only"/></p>
<h3 align="center">Showcase your skills on your GitHub or resumé with ease!</h3>
<hr>

> [!IMPORTANT]  
> NOTE: The older [project](https://github.com/tandpfun/skill-icons) has apparently been abandoned, this project is an open source continuation that aims to improve the search algorithm for icons with mixed themes, as well as caching heavy information such as the database in memory and repeated requests.

<h3 align="center">Powered by Cloudflare Workers ⚡</h3>

# Docs

- [Docs](#docs)
<!-- - [Example](#example) -->
- [Docs](#docs)
- [Specifying Icons](#specifying-icons)
- [Themed Icons](#themed-icons)
- [Icons Per Line](#icons-per-line)
- [Centering Icons](#centering-icons)
- [Pull Request Guide](#pull-request-guide)
  - [Icon format](#icon-format)
  - [Naming icon](#naming-icon)
  - [Defining alias](#defining-alias)
- [💖 Support the Project](#-support-the-project)

<!-- # Example

<p align="center"><img align="center" src="./.github/example-dark.png#gh-dark-mode-only"/></p>
<p align="center"><img align="center" src="./.github/example-light.png#gh-light-mode-only"/></p> -->

# Specifying Icons

Copy and paste the code block below into your readme to add the skills icon element!

Change the `/icons?i=js,html,css` to a list of your skills separated by ","s! You can find a full list of icons [here](./docs/ICONS_AVAILABLES.md).

```md
[![My Skills](https://skill-icons.hallexcosta.com/icons?i=js,ts,react,php,go,rust)](https://skill-icons.hallexcosta.com)
```

![](https://skill-icons.hallexcosta.com/icons?i=js,ts,react,php,go,rust)

# Themed Icons

Some icons have a dark and light themed background. You can specify which theme you want as a url parameter.

This is optional. The default theme is dark.

Change the `/icons?i=<theme>:<icon-id>` to either `original`, `dark` or `light`. The theme is the background color, so light theme has a white icon background, and dark has a black-ish, if theme is not informed, the default theme is applied.

**Random Theme Example:**

```md
[![My Skills](https://skill-icons.hallexcosta.com/icons?i=go,light:kotlin,dark:nodejs,dark:figma)](https://skill-icons.hallexcosta.com)
```

![](https://skill-icons.hallexcosta.com/icons?i=java,kotlin,nodejs,figma)

# Icons Per Line

You can specify how many icons you would like per line! It's an optional argument, and the default is 15.

Change the `&perline=3` to any number between 1 and 50.

```md
[![My Skills](https://skill-icons.hallexcosta.com/icons?i=aws,gcp,azure,react,vue,flutter&perline=3)](https://skill-icons.hallexcosta.com)
```

![](https://skill-icons.hallexcosta.com/icons?i=aws,gcp,azure,react,vue,flutter&perline=3)


# Centering Icons

Want to center the icons in your readme? The SVGs are automatically resized, so you can do it the same way you'd normally center an image.

```html
<p align="center">
  <a href="https://skill-icons.hallexcosta.com/icons?i=git,kubernetes,docker,c,vim">
    <img src="https://skill-icons.hallexcosta.com/icons?i=git,kubernetes,docker,c,vim" />
  </a>
</p>
```

<p align="center">
  <a href="https://skill-icons.hallexcosta.com/icons?i=git,kubernetes,docker,c,vim">
    <img src="https://skill-icons.hallexcosta.com/icons?i=git,kubernetes,docker,c,vim" />
  </a>
</p>

# Pull Request Guide

## Icon format
- Ensure that the icon have a size 256x256 (width x height).
- Ensure that format of icon is `svg`
- Ensure that the icon name have at least a of themes `original`, `dark` or `light`
- Ensure that the corner radius (border radius) is equal 60

## Naming icon
- If you want add only 1 icon, you can define the name using `original:<youricon>`
- Ensure that icon dont have a separator flag as (`\`, `_`, <code>-</code>, `#`, `@`, etc) in icons with compound name to prevent conflicts

:x: **Incorrect**  
`original:styled-components`  
`original:styled#components`  
`original:styled_components`  

:white_check_mark: **Correct**  
`original:styledcomponents`

## Defining alias
- Ensure that the icon dont have repeat alias name
- Ensure the theme is also in the alias name

:x: **Incorrect**
> [!IMPORTANT]  
> Note that the java alias is already being used by another icon, so it cannot be added in javascript.
```json
{
  "javascript": {
    "alias": [
      "javascript",
      "java",
      "original:javascript",
      "dark:javascript",
      "light:javascript"
    ],
    "themes": [
      "original",
      "dark",
      "light"
    ]
  },
  "java": {
    "alias": [
      "java",
      "original:java",
      "dark:java",
      "light:java"
    ],
    "themes": [
      "original",
      "dark",
      "light"
    ]
  }
}
```

:white_check_mark: **Correct**
> [!IMPORTANT]  
> Note that I have now changed the alias name to js and added it in javascript, as it is not being used by another icon.  
> I have also made sure that the themes are being set to that alias as well.
```json
{
  "javascript": {
    "alias": [
      "javascript",
      "js",
      "original:js",
      "dark:js",
      "light:js",
      "original:javascript",
      "dark:javascript",
      "light:javascript"
    ],
    "themes": [
      "original",
      "dark",
      "light"
    ]
  },
  "java": {
    "alias": [
      "java",
      "original:java",
      "dark:java",
      "light:java"
    ],
    "themes": [
      "original",
      "dark",
      "light"
    ]
  }
}
```

# 💖 Support the Project

Thank you so much already for using my projects!

<!-- <a href='https://ko-fi.com/Q5Q860KQ2' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> -->

To support the project directly, feel free to open issues/discussions for icon suggestions, or contribute with a pull request!