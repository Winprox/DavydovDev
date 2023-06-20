import { Point } from 'pixi.js';

export type TType = { id: number; title: string; color: number };

export type TObjectsConfig = {
  objectsCount: [number, number];
  pointsCount: [number, number];
  pointKm: [number, number];
  pointTime: [number, number];
  stayingChance: number;
  stayingTimeDivider: number;
  startTime: [number, number];
  notArrivedChance: number;
  notArrivedKm: [number, number];
};

export type TObjectPoint = { time: number; km: number };
export type TObject = {
  id: string;
  typeId: number;
  points: TObjectPoint[];
};

export type TTopObjectsConfig = {
  opersCount: [number, number];
  opersLength: [number, number];
};

export type TObjectTopOper = { type: string; length: number };
export type TObjectTop = {
  id: string;
  typeId: number;
  arrival: Date;
  opers: TObjectTopOper[];
};

//? Лейбл (title !== undefined) / Линия соединения
export type TObjectDataPrimitive = {
  id: string;
  color: number;
  point: Point;
  title?: string;
};

export type TObjectPrimitive = {
  id: string;
  color: number;
  from: Point;
  to: Point;
};

export type TObjectTopPrimitive = {
  id: string;
  color: number;
  typeIndex: number;
  timeFrom: number;
  timeTo: number;
  opers: TObjectTopOper[];
};
