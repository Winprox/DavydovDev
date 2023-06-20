import { TObject, TObjectPoint, TObjectTop, TObjectsConfig, TTopObjectsConfig, TType } from './@types'; // prettier-ignore

export const MS_IN_MIN = 60000;
const COLORS = [0xec407a, 0xab47bc, 0x66bb6a, 0xffa726];

export const getTypes = async (typesCount: number) => {
  return Array.from({ length: typesCount }, (_, id) => {
    return { id, title: `Категория #${id}`, color: COLORS[id % COLORS.length] };
  }) as TType[];
};

export const getObjects = async (types: TType[], config: TObjectsConfig) => {
  const map = new Map<string, TObject>();

  for (const { id: typeId } of types)
    for (let i = 0; i < rndBetween(config.objectsCount[0], config.objectsCount[1]); i++) {
      let time = rndBetween(config.startTime[0], config.startTime[1]);
      let km =
        Math.random() < config.notArrivedChance / 100
          ? rndBetween(config.notArrivedKm[0], config.notArrivedKm[1])
          : 0;

      const points: TObjectPoint[] = [];

      for (let i = 0; i < rndBetween(config.pointsCount[0], config.pointsCount[1]); i++) {
        const kmRnd = rndBetween(config.pointKm[0], config.pointKm[1]);
        const timeRnd = rndBetween(config.pointTime[0], config.pointTime[1]);

        points.push({ km, time });

        if (Math.random() < config.stayingChance / 100 && km !== 0) {
          if (config.stayingTimeDivider < 1) config.stayingTimeDivider = 1;
          time -= timeRnd / config.stayingTimeDivider;
        } else {
          km += kmRnd;
          time -= timeRnd;
        }
      }

      const id = Math.random().toString().substring(2);
      map.set(id, { id, typeId, points });
    }

  return map;
};

export const getTopObjects = async (
  date: Date,
  objects: TObject[],
  config: TTopObjectsConfig
) => {
  const map = new Map<string, TObjectTop>();

  for (const { id, typeId, points } of objects) {
    const firstPoint = points.at(0);
    if (!firstPoint || firstPoint.km !== 0) continue;

    const arrival = new Date(date.getTime() + firstPoint.time * MS_IN_MIN);
    const opers = Array.from(
      { length: rndBetween(config.opersCount[0], config.opersCount[1]) },
      (_, i) => ({
        type: `Операция #${i}`,
        length: rndBetween(config.opersLength[0], config.opersLength[1]),
      })
    );
    map.set(id, { id, typeId, arrival, opers });
  }

  return map;
};

const rndBetween = (min: number, max: number) => {
  const minToUse = min < max ? min : max;
  const maxToUse = max > min ? max : min;
  return minToUse + Math.floor(Math.random() * (maxToUse - minToUse));
};
