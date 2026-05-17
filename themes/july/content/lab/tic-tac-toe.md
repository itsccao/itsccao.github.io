+++
title = "Tic Tac Toe"
description = "A standard 3x3 Tic-Tac-Toe."
date = "2024-07-29"
tags = [
    "javascript"
]
+++

</br>

<div id="ttt-board">
    <div class="ttt-board-split">
        <div class="ttt-square" id="0"> </div>
        <div class="ttt-square" id="1"> </div>
        <div class="ttt-square" id="2"> </div>
    </div>
    <div class="ttt-board-split">
        <div class="ttt-square" id="3"> </div>
        <div class="ttt-square" id="4"> </div>
        <div class="ttt-square" id="5"> </div>
    </div>
    <div class="ttt-board-split">
        <div class="ttt-square" id="6"> </div>
        <div class="ttt-square" id="7"> </div>
        <div class="ttt-square" id="8"> </div>
    </div>
</div>

<p> Result: <b><text id="ttt-display-result" class="highlight"> </text></b> </p>

<button id="ttt-restart" onclick="restartGame()"> Restart </button>

<style>
    .ttt-square
    {
        width: 5.5rem;
        height: 5.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--off-background);
        border: 2px solid var(--box-shadow-hover);
        border-radius: 1rem;
        color: var(--text);
        font-family: monospace;
        font-size: 3rem;
        font-weight: bold;
        transition: transform 0.1s ease, border-color 0.2s ease, background-color 0.2s ease;
    }

    .ttt-square:hover
    {
        cursor: pointer;
        border-color: var(--link-hover);
        transform: scale(1.05);
    }

    #ttt-board
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    .ttt-board-split
    {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    }

    #ttt-restart
    {
        padding: 0.75rem 1.5rem;
        background-color: var(--off-background);
        border: 2px solid var(--box-shadow-hover);
        border-radius: 0.5rem;
        color: var(--text);
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.2s ease;
        margin-top: 1rem;
    }

    #ttt-restart:hover
    {
        cursor: pointer;
        border-color: var(--link-hover);
        color: var(--link-hover);
        transform: translateY(-2px);
    }
</style>

<script src="/js/tic-tac-toe.js"> </script>