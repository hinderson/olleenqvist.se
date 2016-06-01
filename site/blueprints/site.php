<?php if(!defined('KIRBY')) exit ?>

title: Site
pages: default
fields:
  title:
    label: Title
    type:  text
  author:
    label: Author
    type:  text
  pageTitle:
    label: Page title
    type: text
    help: Used on Facebook and in SEO.
  description:
    label: Description
    type:  textarea
    validate:
      max: 155
    help: Used on Facebook and in SEO.
