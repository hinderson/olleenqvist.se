<?php if(!defined('KIRBY')) exit ?>

title: Video
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
        label: Video
        type: builder
        required: false
        fieldsets:
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
