/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.tjtolley.carcassonne.game;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Lists;
import com.google.common.collect.Table;
import java.util.List;
import java.util.UUID;

/**
 *
 * @author tyler
 */
public class Game
{
    private final Table<Integer, Integer, PlacedTile> map;
    private final List<PlacedTile> placedTiles;
    private final List<Position> placeableLocations;
    private final String name;
    private final UUID id;
    List<Player> players;
    int currentRound = 0;

    public Game(String name, UUID id, List<Player> players)
    {
        this.map = HashBasedTable.create();
        this.name = name;
        this.id = id;
        this.players = players;
        this.placedTiles = Lists.newArrayList();
        this.placeableLocations = Lists.newArrayList();
    }

    public String getName()
    {
        return name;
    }

    public UUID getId()
    {
        return id;
    }

    public void placeTile(TileDefinition tile, Position location)
    {
        if (!placeableLocations.contains(location)) {
            throw new IllegalArgumentException("Invalid location for tile");
        }
        // Add surrounding locations to placeable locations 
        if(!map.contains(location.x-1, location.y))
            placeableLocations.add(new Position(location.x-1, location.y));
        if(!map.contains(location.x+1, location.y))
            placeableLocations.add(new Position(location.x+1, location.y));
        if(!map.contains(location.x, location.y-1))
            placeableLocations.add(new Position(location.x, location.y-1));
        if(!map.contains(location.x, location.y+1))
            placeableLocations.add(new Position(location.x, location.y+1));
        
    }

}
