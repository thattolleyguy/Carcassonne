package com.tjtolley.carcassonne.game;

import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.BiMap;
import com.google.common.collect.HashBiMap;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;
import java.util.List;
import java.util.Map;

public class TileDefinition
{
    private final String textureName;
    private final Map<FeaturePosition, Integer> featurePositions;
    private final Map<Integer, FeatureType> featureIds;
    private final Multimap<Integer, Integer> featureLinks;

    public TileDefinition(String textureName, Map<FeaturePosition, Integer> featurePositions, Map<Integer, FeatureType> featureIds, Multimap<Integer, Integer> featureLinks)
    {
        this.textureName = textureName;
        this.featurePositions = featurePositions;
        this.featureIds = featureIds;
        this.featureLinks = featureLinks;
    }

    public static TileDefinition fromMap(Map<String, Object> map)
    {
        final List<Map<String, Object>> featureMapList = (List<Map<String, Object>>) map.get("features");
        Map<FeaturePosition, Integer> positionMap = Maps.newHashMap();
        Multimap<Integer, Integer> featureLinks = ArrayListMultimap.create();
        Map<Integer, FeatureType> featureIds = Maps.newHashMap();
        for (Map<String, Object> featureMap : featureMapList) {
            Integer id = (Integer) featureMap.get("id");
            FeatureType type = FeatureType.valueOf((String) featureMap.get("type"));
            List<String> featurePositions = (List<String>) featureMap.get("featurePositions");
            for (String edgeConnection : featurePositions) {
                positionMap.put(FeaturePosition.valueOf(edgeConnection), id);
            }
            List<Integer> featureConnections = (List<Integer>) featureMap.get("featureConnections");
            if (featureConnections != null) {
                featureLinks.putAll(id, featureConnections);
            }
            featureIds.put(id, type);
        }
        final String textureName = (String) map.get("textureName");
        return new TileDefinition(textureName, positionMap, featureIds, featureLinks);
    }

}
