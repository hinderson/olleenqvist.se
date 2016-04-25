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
    media:
        label: Project media
        type: builder
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
                entry: >
                    <div style="display: table; width: 100%;">
                        <div style="float: left; position: relative; overflow: hidden; width: 50px; height: 50px; vertical-align: top; margin-right: 10px;"><video src="{{_fileUrl}}{{placeholder}}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"></video></div>
                        <strong>{{placeholder}}</strong><br>
                        <a href="{{video}}"><em style="font-size: 14px;">{{video}}</em></a>
                    </div>
                fields:
                    video:
                        label: Enter video URL (Vimeo or YouTube)
                        type: text
                    placeholder:
                        label: Pick placeholder video (needs to be uploaded to the project first)
                        type: select
                        options: videos
