/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.tjtolley.carcassonne.game;

import com.google.common.collect.Table;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 *
 * @author tyler
 */
public class Game
{
    private final Table<Integer, Integer, Tile> map;
    
    private final String name;
    private final UUID id;
    List<Player> players;
    int currentRound = 0;

    public Game(Table<Integer, Integer, Tile> map, String name, UUID id,  List<Player> players)
    {
        this.map = map;
        this.name = name;
        this.id = id;
        this.players = players;
    }



    public String getName()
    {
        return name;
    }

    public UUID getId()
    {
        return id;
    }

}
