'use client';

import { useState, useContext, useRef, useEffect, createContext } from 'react';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

interface BaseMapContextType {
  baseMap: Map | undefined;
  setBaseMap: (map: Map) => void;
}

const BaseMapContext = createContext<BaseMapContextType | undefined>(undefined);

interface BaseMapProviderProps {
  children: React.ReactNode;
}

export function BaseMapProvider({ children }: BaseMapProviderProps) {
  const [baseMap, setBaseMap] = useState<Map | undefined>(undefined);

  return (
    <BaseMapContext.Provider value={{ baseMap, setBaseMap }}>
      {children}
    </BaseMapContext.Provider>
  );
}

export function useBaseMap() {
  const baseMapContext = useContext(BaseMapContext);

  if (!baseMapContext) {
    throw new Error('BaseMapContext is not defined.');
  }

  return baseMapContext;
}

interface BaseMapProps {
  initialCoordinate: [number, number];
  initialZoomLevel: number;
}

export function BaseMap({ initialCoordinate, initialZoomLevel }: BaseMapProps) {
  const { setBaseMap } = useBaseMap();
  const baseMapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const baseMap = new Map({
      target: baseMapRef.current as HTMLDivElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(initialCoordinate),
        zoom: initialZoomLevel,
      }),
    });

    setBaseMap(baseMap);

    return () => {
      baseMap.setTarget(undefined);
    };
  }, [setBaseMap, initialCoordinate, initialZoomLevel]);

  return <div className="w-full h-full" ref={baseMapRef}></div>;
}
