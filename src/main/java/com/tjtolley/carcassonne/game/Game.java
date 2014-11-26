/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.tjtolley.carcassonne.game;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.google.common.collect.Table;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 *
 * @author tyler
 */
public class Game
{
    private final Table<Integer, Integer, PlacedTile> map;
    private final List<PlacedTile> placedTiles;
    private final Set<Position> placeableLocations;
    private final String gameName;
    private final UUID id;
//    List<Player> players;

    public Game(String name, UUID id)//, List<Player> players)
    {
        this.map = HashBasedTable.create();
        this.gameName = name;
        this.id = id;
//        this.players = players;
        this.placedTiles = Lists.newArrayList();
        this.placeableLocations = Sets.newHashSet(new Position(0, 0));
    }

    public String getName()
    {
        return gameName;
    }

    public UUID getId()
    {
        return id;
    }

    public boolean isValid(String tileName, Position location)
    {
        return placeableLocations.contains(location);
    }

    public void placeTile(String tileName, Position location)
    {
        if (!placeableLocations.contains(location)) {
            throw new IllegalArgumentException("Invalid location for tile");
        }
        final PlacedTile placedTile = new PlacedTile(location, tileName);
        this.placedTiles.add(placedTile);
        this.map.put(location.x, location.y, placedTile);
        this.placeableLocations.remove(location);
        // Add surrounding locations to placeable locations 
        if (!map.contains(location.x - 1, location.y)) {
            placeableLocations.add(new Position(location.x - 1, location.y));
        }
        if (!map.contains(location.x + 1, location.y)) {
            placeableLocations.add(new Position(location.x + 1, location.y));
        }
        if (!map.contains(location.x, location.y - 1)) {
            placeableLocations.add(new Position(location.x, location.y - 1));
        }
        if (!map.contains(location.x, location.y + 1)) {
            placeableLocations.add(new Position(location.x, location.y + 1));
        }
    }

    public List<PlacedTile> getPlacedTiles()
    {
        return placedTiles;
    }

    public Set<Position> getPlaceableLocations()
    {
        return placeableLocations;
    }
    

}
