package com.tjtolley.carcassonne.game;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Collections2;
import com.google.common.collect.Lists;
import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class TileDeck
{
    private final List<TileDefinition> tiles;
    int curPosition = 0;

    private TileDeck(List<TileDefinition> tiles)
    {
        this.tiles = tiles;
    }

    public TileDefinition getNextTile()
    {
        if (curPosition < tiles.size()) {
            return tiles.get(curPosition++);
        }
        return null;
    }

    public int getRemainingTiles()
    {
        return tiles.size() - curPosition;
    }

    public static TileDeck fromFile(String... files)
    {
        List<TileDefinition> tiles = Lists.newArrayList();
        for (String file : files) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                List<Map<String, Object>> tileSetList = mapper.readValue(new File("tileSets/" + file), List.class);
                for (Map<String, Object> tile : tileSetList) {
                    TileDefinition tileDefinition = TileDefinition.fromMap(tile);
                    int count = (int) tile.get("count");
                    for (int i = 0; i < count; i++) {
                        tiles.add(tileDefinition);
                    }
                }
            }
            catch (IOException ex) {
                Logger.getLogger(TileDeck.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        Collections.shuffle(tiles);
        return new TileDeck(tiles);
    }
}
