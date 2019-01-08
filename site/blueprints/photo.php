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

            video:
                label: Video
                fields:
                    video:
                        label: Enter video URL (Vimeo or YouTube)
                        type: text
                    placeholder:
                        label: Pick placeholder (needs to be uploaded to the project first)
                        type: select
                        options: files
