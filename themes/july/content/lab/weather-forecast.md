+++
title = "Weather Forecast"
description = "Get the weather forecast for your location today."
date = "2025-03-25"
tags = [
    "javascript"
]
+++

API used: [open-meteo.com](https://open-meteo.com/)

<h2> Enter your location: </h2>

</br>

<div id="weather-container">
    <textarea id="weather-input" placeholder="Your city/country..." autofocus></textarea>
    <button id="weather-submit"> Submit </button>
</div>

<div id="weather-error"> </div>

<h2> Location(s) searched: </h2>

<div id="weather-result"> </div>

<style>
    #weather-container
    {
        display: flex;
        gap: 1rem;
    }

    #weather-input
    {
        max-width: 20rem;
        height: 2.5rem;
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
        background-color: var(--off-background);
        border-radius: 0.25rem;
        border-color: var(--text);
        color: var(--text);
        resize: none;
    }

    #weather-input::placeholder
    {
        color: var(--text);
    }

    #weather-submit
    {
        width: 5rem;
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
        display: inline-block;
        background-color: var(--off-background);
        border-style: none;
        border-radius: 0.25rem;
        color: var(--text);
    }

    #weather-submit:hover
    {
        background-color: var(--hover-svg);
        border-style: solid;
        border-width: 0.125rem;
        border-color: var(--text);
    }

    #weather-submit:hover
    {
        cursor: pointer;
    }
</style>

<script src="/js/weather-forecast.js"> </script>