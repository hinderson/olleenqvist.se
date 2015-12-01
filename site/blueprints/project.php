<?php if(!defined('KIRBY')) exit ?>

title: Project
pages: false
files:
  sortable: true
fields:
  project:
    label: Project name
    type:  text
  client:
    label: Client
    type:  text
  year:
    label: Year
    type:  text
  text:
    label: Text
    type:  textarea
  tags:
    label: Tags
    type:  tags
