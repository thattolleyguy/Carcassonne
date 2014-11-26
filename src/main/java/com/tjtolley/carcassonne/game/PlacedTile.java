package com.tjtolley.carcassonne.game;

public class PlacedTile
{
    private final Position position;
    private final String tileName;

    public PlacedTile(Position position, String tileName)
    {
        this.position = position;
        this.tileName = tileName;
    }

    public Position getPosition()
    {
        return position;
    }

    public String getTileName()
    {
        return tileName;
    }

}
