/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.tjtolley.carcassonne.game;

import java.util.List;

/**
 *
 * @author tyler
 */
public class Feature
{
    List<Feature> linkedFeatures;
    List<FeaturePosition> featurePositions;
    FeatureType type;
    

    public static enum FeatureType
    {
        FARM,
        CITY,
        ROAD,
        CLOISTER;
    }
    
    public static enum FeaturePosition
    {
        NORTH,
        NORTH_EAST,
        NORTH_WEST,
        EAST_NORTH,
        EAST,
        EAST_SOUTH,
        SOUTH,
        SOUTH_EAST,
        SOUTH_WEST,
        WEST,
        WEST_NORTH,
        WEST_SOUTH,
        CENTER;
    }
}
