+++
title = "Weather Forecast"
description = "Check today's weather forecast."
date = "2025-03-25"
tags = [
    "javascript"
]
+++

<p class="api-credit"> Weather data: <a href="https://open-meteo.com/" target="_blank">Open-Meteo API</a>. </p>

<h2> Enter location: </h2>

<div id="weather-container">
    <input type="text" id="weather-input" placeholder="Your location..." autofocus>
    <button id="weather-submit"> Search </button>
</div>

<p id="weather-error"> </p>

<h2> Location(s) searched: </h2>

<div id="weather-result"> </div>

<style>
    .api-credit {
        font-style: italic;
        opacity: 0.8;
        margin-bottom: 2rem;
    }

    #weather-container
    {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        width: 100%;
        max-width: 30rem;
    }

    h2
    {
        margin-bottom: 1.25rem;
    }

    #weather-input
    {
        flex: 1 1 200px;
        box-sizing: border-box;
        padding: 0.8rem 1rem;
        background-color: var(--off-background);
        border: 2px solid var(--box-shadow-hover);
        border-radius: 0.5rem;
        color: var(--text);
        font-size: 1.1rem;
        transition: border-color 0.2s ease;
    }

    #weather-input:focus
    {
        outline: none;
        border-color: var(--link-hover);
    }

    #weather-submit
    {
        box-sizing: border-box;
        padding: 0.8rem 1.5rem;
        background-color: var(--off-background);
        border: 2px solid var(--box-shadow-hover);
        border-radius: 0.5rem;
        color: var(--text);
        font-size: 1.1rem;
        font-weight: 600;
        transition: all 0.2s ease;
    }

    #weather-submit:hover
    {
        cursor: pointer;
        border-color: var(--link-hover);
        color: var(--link-hover);
        transform: translateY(-2px);
    }

    .weather-card {
        background-color: var(--off-background);
        border: 2px solid var(--box-shadow-hover);
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    
    .weather-card:hover {
        border-color: var(--link-hover);
        transform: translateY(-2px);
    }

    .weather-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        border-bottom: 2px solid var(--box-shadow-hover);
        padding-bottom: 1rem;
        margin-bottom: 1rem;
    }

    .weather-header h3 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--link-hover);
    }

    .weather-code {
        font-weight: 600;
        color: var(--text);
        font-size: 0.95rem;
    }

    .weather-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1.5rem;
    }

    .weather-item {
        display: flex;
        flex-direction: column;
    }

    .weather-item .label {
        font-size: 0.75rem;
        opacity: 0.7;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.25rem;
    }

    .weather-item .value {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text);
    }

    .weather-item .sub-label {
        font-size: 0.85rem;
        opacity: 0.8;
        margin-top: 0.25rem;
    }
</style>

<script src="/js/weather-forecast.js"> </script>