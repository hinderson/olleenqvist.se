<?php if(!defined('KIRBY')) exit ?>

title: Photo
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
    media:
        label: Photos
        type: builder
        required: false
        fieldsets:
            image:
                label: Image
                fields:
                    image:
                        label: Choose image
                        type: select
                        options: images
