import { queryResolvers } from './query';
import { forecastResolvers } from './forecast';
import { locationResolvers } from './location';

type ResolverFunction = (parent: any, args: any, context: any, info: any) => any;

interface ResolverMap {
  [key: string]: ResolverFunction;
}

interface Resolvers {
  Query: ResolverMap;
  Forecast: ResolverMap;
  Location: ResolverMap;
  [key: string]: ResolverMap;
}

export const resolvers: Resolvers = {
  Query: queryResolvers as ResolverMap,
  Forecast: forecastResolvers as ResolverMap,
  Location: locationResolvers as ResolverMap
};

export const createResolversWithContext = (): Resolvers => {
  const resolversWithContext: Resolvers = { ...resolvers };
  
  const contextEnhancer = (fn: ResolverFunction): ResolverFunction => {
    return (parent: any, args: any, context: any, info: any) => {
      if (!context.resolvers) {
        context.resolvers = resolversWithContext;
      }
      return fn(parent, args, context, info);
    };
  };

  Object.keys(resolversWithContext.Query).forEach(key => {
    const original = resolversWithContext.Query[key];
    resolversWithContext.Query[key] = contextEnhancer(original);
  });

  Object.keys(resolversWithContext.Location).forEach(key => {
    const original = resolversWithContext.Location[key];
    resolversWithContext.Location[key] = contextEnhancer(original);
  });

  return resolversWithContext;
};

export default createResolversWithContext();
