<?php if(!defined('KIRBY')) exit ?>

title: Project
pages: false
files:
  sortable: true
fields:
  title:
    label: Title
    type: text
  subtitle:
    label: Subtitle
    type: text
  description:
    label: Description
    type:  textarea
    validate:
        min: 10
        max: 270
