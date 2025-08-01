/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * 텍스트 벡터 검색 시스템
 * 교사-학부모 정기상담 내용 벡터 검색 시스템
 * OpenAPI spec version: 1.0.0
 */
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  ConsultationCreate,
  ConsultationResponse,
  ConsultationSearchRequest,
  ConsultationSearchResponse,
  ConsultationUpdate,
  HTTPValidationError,
  ReadConsultationsApiV1ConsultationsGetParams
} from './model';

import { customInstance } from './mutator/api-client';




/**
 * Health check endpoint.
 * @summary Health Check
 */
export const healthCheckApiV1HealthGet = (
    
 signal?: AbortSignal
) => {
      
      
      return customInstance<unknown>(
      {url: `/api/v1/health`, method: 'GET', signal
    },
      );
    }
  

export const getHealthCheckApiV1HealthGetQueryKey = () => {
    return [`/api/v1/health`] as const;
    }

    
export const getHealthCheckApiV1HealthGetQueryOptions = <TData = Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>, TError = unknown>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getHealthCheckApiV1HealthGetQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>> = ({ signal }) => healthCheckApiV1HealthGet(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type HealthCheckApiV1HealthGetQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>>
export type HealthCheckApiV1HealthGetQueryError = unknown


export function useHealthCheckApiV1HealthGet<TData = Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>, TError = unknown>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>,
          TError,
          Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useHealthCheckApiV1HealthGet<TData = Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>,
          TError,
          Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useHealthCheckApiV1HealthGet<TData = Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Health Check
 */

export function useHealthCheckApiV1HealthGet<TData = Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheckApiV1HealthGet>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getHealthCheckApiV1HealthGetQueryOptions(options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new consultation.
 * @summary Create Consultation
 */
export const createConsultationApiV1ConsultationsPost = (
    consultationCreate: ConsultationCreate,
 signal?: AbortSignal
) => {
      
      
      return customInstance<ConsultationResponse>(
      {url: `/api/v1/consultations`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: consultationCreate, signal
    },
      );
    }
  


export const getCreateConsultationApiV1ConsultationsPostMutationOptions = <TError = HTTPValidationError,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createConsultationApiV1ConsultationsPost>>, TError,{data: ConsultationCreate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof createConsultationApiV1ConsultationsPost>>, TError,{data: ConsultationCreate}, TContext> => {

const mutationKey = ['createConsultationApiV1ConsultationsPost'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createConsultationApiV1ConsultationsPost>>, {data: ConsultationCreate}> = (props) => {
          const {data} = props ?? {};

          return  createConsultationApiV1ConsultationsPost(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type CreateConsultationApiV1ConsultationsPostMutationResult = NonNullable<Awaited<ReturnType<typeof createConsultationApiV1ConsultationsPost>>>
    export type CreateConsultationApiV1ConsultationsPostMutationBody = ConsultationCreate
    export type CreateConsultationApiV1ConsultationsPostMutationError = HTTPValidationError

    /**
 * @summary Create Consultation
 */
export const useCreateConsultationApiV1ConsultationsPost = <TError = HTTPValidationError,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createConsultationApiV1ConsultationsPost>>, TError,{data: ConsultationCreate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createConsultationApiV1ConsultationsPost>>,
        TError,
        {data: ConsultationCreate},
        TContext
      > => {

      const mutationOptions = getCreateConsultationApiV1ConsultationsPostMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    
/**
 * Get list of consultations.
 * @summary Read Consultations
 */
export const readConsultationsApiV1ConsultationsGet = (
    params?: ReadConsultationsApiV1ConsultationsGetParams,
 signal?: AbortSignal
) => {
      
      
      return customInstance<ConsultationResponse[]>(
      {url: `/api/v1/consultations`, method: 'GET',
        params, signal
    },
      );
    }
  

export const getReadConsultationsApiV1ConsultationsGetQueryKey = (params?: ReadConsultationsApiV1ConsultationsGetParams,) => {
    return [`/api/v1/consultations`, ...(params ? [params]: [])] as const;
    }

    
export const getReadConsultationsApiV1ConsultationsGetQueryOptions = <TData = Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>, TError = HTTPValidationError>(params?: ReadConsultationsApiV1ConsultationsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getReadConsultationsApiV1ConsultationsGetQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>> = ({ signal }) => readConsultationsApiV1ConsultationsGet(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ReadConsultationsApiV1ConsultationsGetQueryResult = NonNullable<Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>>
export type ReadConsultationsApiV1ConsultationsGetQueryError = HTTPValidationError


export function useReadConsultationsApiV1ConsultationsGet<TData = Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>, TError = HTTPValidationError>(
 params: undefined |  ReadConsultationsApiV1ConsultationsGetParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>,
          TError,
          Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReadConsultationsApiV1ConsultationsGet<TData = Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>, TError = HTTPValidationError>(
 params?: ReadConsultationsApiV1ConsultationsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>,
          TError,
          Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReadConsultationsApiV1ConsultationsGet<TData = Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>, TError = HTTPValidationError>(
 params?: ReadConsultationsApiV1ConsultationsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Read Consultations
 */

export function useReadConsultationsApiV1ConsultationsGet<TData = Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>, TError = HTTPValidationError>(
 params?: ReadConsultationsApiV1ConsultationsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof readConsultationsApiV1ConsultationsGet>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getReadConsultationsApiV1ConsultationsGetQueryOptions(params,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Get consultation by ID.
 * @summary Read Consultation
 */
export const readConsultationApiV1ConsultationsConsultationIdGet = (
    consultationId: number,
 signal?: AbortSignal
) => {
      
      
      return customInstance<ConsultationResponse>(
      {url: `/api/v1/consultations/${consultationId}`, method: 'GET', signal
    },
      );
    }
  

export const getReadConsultationApiV1ConsultationsConsultationIdGetQueryKey = (consultationId: number,) => {
    return [`/api/v1/consultations/${consultationId}`] as const;
    }

    
export const getReadConsultationApiV1ConsultationsConsultationIdGetQueryOptions = <TData = Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>, TError = HTTPValidationError>(consultationId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getReadConsultationApiV1ConsultationsConsultationIdGetQueryKey(consultationId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>> = ({ signal }) => readConsultationApiV1ConsultationsConsultationIdGet(consultationId, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(consultationId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ReadConsultationApiV1ConsultationsConsultationIdGetQueryResult = NonNullable<Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>>
export type ReadConsultationApiV1ConsultationsConsultationIdGetQueryError = HTTPValidationError


export function useReadConsultationApiV1ConsultationsConsultationIdGet<TData = Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>, TError = HTTPValidationError>(
 consultationId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>,
          TError,
          Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReadConsultationApiV1ConsultationsConsultationIdGet<TData = Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>, TError = HTTPValidationError>(
 consultationId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>,
          TError,
          Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReadConsultationApiV1ConsultationsConsultationIdGet<TData = Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>, TError = HTTPValidationError>(
 consultationId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Read Consultation
 */

export function useReadConsultationApiV1ConsultationsConsultationIdGet<TData = Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>, TError = HTTPValidationError>(
 consultationId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof readConsultationApiV1ConsultationsConsultationIdGet>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getReadConsultationApiV1ConsultationsConsultationIdGetQueryOptions(consultationId,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update consultation.
 * @summary Update Consultation
 */
export const updateConsultationApiV1ConsultationsConsultationIdPut = (
    consultationId: number,
    consultationUpdate: ConsultationUpdate,
 ) => {
      
      
      return customInstance<ConsultationResponse>(
      {url: `/api/v1/consultations/${consultationId}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: consultationUpdate
    },
      );
    }
  


export const getUpdateConsultationApiV1ConsultationsConsultationIdPutMutationOptions = <TError = HTTPValidationError,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateConsultationApiV1ConsultationsConsultationIdPut>>, TError,{consultationId: number;data: ConsultationUpdate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof updateConsultationApiV1ConsultationsConsultationIdPut>>, TError,{consultationId: number;data: ConsultationUpdate}, TContext> => {

const mutationKey = ['updateConsultationApiV1ConsultationsConsultationIdPut'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateConsultationApiV1ConsultationsConsultationIdPut>>, {consultationId: number;data: ConsultationUpdate}> = (props) => {
          const {consultationId,data} = props ?? {};

          return  updateConsultationApiV1ConsultationsConsultationIdPut(consultationId,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type UpdateConsultationApiV1ConsultationsConsultationIdPutMutationResult = NonNullable<Awaited<ReturnType<typeof updateConsultationApiV1ConsultationsConsultationIdPut>>>
    export type UpdateConsultationApiV1ConsultationsConsultationIdPutMutationBody = ConsultationUpdate
    export type UpdateConsultationApiV1ConsultationsConsultationIdPutMutationError = HTTPValidationError

    /**
 * @summary Update Consultation
 */
export const useUpdateConsultationApiV1ConsultationsConsultationIdPut = <TError = HTTPValidationError,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateConsultationApiV1ConsultationsConsultationIdPut>>, TError,{consultationId: number;data: ConsultationUpdate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateConsultationApiV1ConsultationsConsultationIdPut>>,
        TError,
        {consultationId: number;data: ConsultationUpdate},
        TContext
      > => {

      const mutationOptions = getUpdateConsultationApiV1ConsultationsConsultationIdPutMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    
/**
 * Delete consultation.
 * @summary Delete Consultation
 */
export const deleteConsultationApiV1ConsultationsConsultationIdDelete = (
    consultationId: number,
 ) => {
      
      
      return customInstance<unknown>(
      {url: `/api/v1/consultations/${consultationId}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteConsultationApiV1ConsultationsConsultationIdDeleteMutationOptions = <TError = HTTPValidationError,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteConsultationApiV1ConsultationsConsultationIdDelete>>, TError,{consultationId: number}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteConsultationApiV1ConsultationsConsultationIdDelete>>, TError,{consultationId: number}, TContext> => {

const mutationKey = ['deleteConsultationApiV1ConsultationsConsultationIdDelete'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteConsultationApiV1ConsultationsConsultationIdDelete>>, {consultationId: number}> = (props) => {
          const {consultationId} = props ?? {};

          return  deleteConsultationApiV1ConsultationsConsultationIdDelete(consultationId,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteConsultationApiV1ConsultationsConsultationIdDeleteMutationResult = NonNullable<Awaited<ReturnType<typeof deleteConsultationApiV1ConsultationsConsultationIdDelete>>>
    
    export type DeleteConsultationApiV1ConsultationsConsultationIdDeleteMutationError = HTTPValidationError

    /**
 * @summary Delete Consultation
 */
export const useDeleteConsultationApiV1ConsultationsConsultationIdDelete = <TError = HTTPValidationError,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteConsultationApiV1ConsultationsConsultationIdDelete>>, TError,{consultationId: number}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteConsultationApiV1ConsultationsConsultationIdDelete>>,
        TError,
        {consultationId: number},
        TContext
      > => {

      const mutationOptions = getDeleteConsultationApiV1ConsultationsConsultationIdDeleteMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    
/**
 * Search consultations using vector similarity.
 * @summary Search Consultations
 */
export const searchConsultationsApiV1ConsultationsSearchPost = (
    consultationSearchRequest: ConsultationSearchRequest,
 signal?: AbortSignal
) => {
      
      
      return customInstance<ConsultationSearchResponse>(
      {url: `/api/v1/consultations/search`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: consultationSearchRequest, signal
    },
      );
    }
  


export const getSearchConsultationsApiV1ConsultationsSearchPostMutationOptions = <TError = HTTPValidationError,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof searchConsultationsApiV1ConsultationsSearchPost>>, TError,{data: ConsultationSearchRequest}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof searchConsultationsApiV1ConsultationsSearchPost>>, TError,{data: ConsultationSearchRequest}, TContext> => {

const mutationKey = ['searchConsultationsApiV1ConsultationsSearchPost'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof searchConsultationsApiV1ConsultationsSearchPost>>, {data: ConsultationSearchRequest}> = (props) => {
          const {data} = props ?? {};

          return  searchConsultationsApiV1ConsultationsSearchPost(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type SearchConsultationsApiV1ConsultationsSearchPostMutationResult = NonNullable<Awaited<ReturnType<typeof searchConsultationsApiV1ConsultationsSearchPost>>>
    export type SearchConsultationsApiV1ConsultationsSearchPostMutationBody = ConsultationSearchRequest
    export type SearchConsultationsApiV1ConsultationsSearchPostMutationError = HTTPValidationError

    /**
 * @summary Search Consultations
 */
export const useSearchConsultationsApiV1ConsultationsSearchPost = <TError = HTTPValidationError,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof searchConsultationsApiV1ConsultationsSearchPost>>, TError,{data: ConsultationSearchRequest}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof searchConsultationsApiV1ConsultationsSearchPost>>,
        TError,
        {data: ConsultationSearchRequest},
        TContext
      > => {

      const mutationOptions = getSearchConsultationsApiV1ConsultationsSearchPostMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    
/**
 * @summary Root
 */
export const rootGet = (
    
 signal?: AbortSignal
) => {
      
      
      return customInstance<unknown>(
      {url: `/`, method: 'GET', signal
    },
      );
    }
  

export const getRootGetQueryKey = () => {
    return [`/`] as const;
    }

    
export const getRootGetQueryOptions = <TData = Awaited<ReturnType<typeof rootGet>>, TError = unknown>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof rootGet>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getRootGetQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof rootGet>>> = ({ signal }) => rootGet(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof rootGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type RootGetQueryResult = NonNullable<Awaited<ReturnType<typeof rootGet>>>
export type RootGetQueryError = unknown


export function useRootGet<TData = Awaited<ReturnType<typeof rootGet>>, TError = unknown>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof rootGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof rootGet>>,
          TError,
          Awaited<ReturnType<typeof rootGet>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRootGet<TData = Awaited<ReturnType<typeof rootGet>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof rootGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof rootGet>>,
          TError,
          Awaited<ReturnType<typeof rootGet>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRootGet<TData = Awaited<ReturnType<typeof rootGet>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof rootGet>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Root
 */

export function useRootGet<TData = Awaited<ReturnType<typeof rootGet>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof rootGet>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getRootGetQueryOptions(options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




