<?php if(!defined('KIRBY')) exit ?>

title: Project
pages: false
files:
  sortable: true
fields:
    title:
        label: Title
        type: text
    category:
        label: Category
        type: select
        default: photo
        width: 1/4
        required: true
        options:
            photo: Photo
            video: Video
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
        label: Project media
        type: builder
        required: false
        fieldsets:
            image:
                label: Image
                entry: >
                    <div style="display: table; width: 100%;">
                        <div style="float: left; width: 50px; height: 50px; vertical-align: top; margin-right: 10px; background-image: url({{_fileUrl}}{{image}}); background-position: 50% 50%; background-size: cover;"></div>
                        <strong>{{image}}</strong>
                    </div>
                fields:
                    image:
                        label: Choose image
                        type: select
                        options: images
            video:
                label: Video
                snippet: builder/preview
                fields:
                    video:
                        label: Enter video URL (Vimeo or YouTube)
                        type: text
                    placeholder:
                        label: Pick placeholder (needs to be uploaded to the project first)
                        type: select
                        options: files
