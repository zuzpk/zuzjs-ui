import { dynamic } from "@zuzjs/core";
import { InputProps } from "../Input/types"

/**
 * Dynamic data configuration for AutoComplete API fetching
 */
export type AutoCompleteDynamicOptions = {
    /**
     * API endpoint URL to fetch suggestions
     * Example: '/api/search'
     */
    action: string;
    
    /**
     * HTTP method for the request
     * @default 'POST'
     */
    method?: 'GET' | 'POST';
    
    /**
     * Query parameter name for the search query
     * @default 'query'
     */
    queryParam?: string;
    
    /**
     * Additional data to send with the request
     */
    params?: dynamic;
    
    /**
     * Custom response data transformer
     * receives response data and should return string array
     * 
     * @example
     * ```tsx
     * transformResponse: (data) => data.results.map(item => item.name)
     * ```
     */
    transformResponse?: (data: dynamic) => string[];
    
    /**
     * Minimum characters before triggering search
     * @default 1
     */
    minChars?: number;
    
    /**
     * Debounce delay in milliseconds
     * @default 250
     */
    debounce?: number;
}

export type AutoCompleteProps = Omit<InputProps, 'onSelect'> & {
    /**
     * Data source for suggestions
     * 
     * Supports three formats:
     * 1. **Static string array**: ['Apple', 'Banana', 'Cherry']
     * 2. **Dynamic object array**: [{name: 'Apple'}, {name: 'Banana'}]
     * 3. **API configuration**: Use `dynamic` prop for server-side search
     * 
     * When passing dynamic objects, use `dataKey` to specify which field (or fields) to use as the suggestion value.
     * 
     * @example
     * ```tsx
     * // Static strings
     * data={['Apple', 'Banana', 'Cherry']}
     * 
     * // Dynamic objects
     * data={[
     *   { id: 1, name: 'Apple', price: 1.99 },
     *   { id: 2, name: 'Banana', price: 0.99 }
     * ]}
     * dataKey="name"
     * ```
     */
    data?: string[] | dynamic[];
    
    /**
     * Field name(s) to extract from dynamic objects when `data` is an object array.
     *
     * A string uses one field. An array uses those fields in order: each
     * non-empty value is searchable, and they are joined with a space for the
     * suggestion label and committed input value. The first key is used when
     * wrapping a custom/string item (`{ [dataKey[0]]: value }`).
     *
     * If omitted, keys are inferred from string/number fields on objects in
     * `data` (or from API results). Falls back to `'name'` when nothing can
     * be inferred.
     *
     * @example
     * ```tsx
     * data={[{id: 1, name: 'Apple'}]}
     * dataKey="name"
     *
     * data={[{ firstName: 'Jane', lastName: 'Smith', email: 'jane@acme.com' }]}
     * dataKey={['firstName', 'lastName']}
     * ```
     */
    dataKey?: string | string[];
    
    /**
     * Dynamic API configuration for fetching suggestions from server
     * Use this for server-side search
     * 
     * @example
     * ```tsx
     * dynamic={{
     *   action: '/api/search',
     *   method: 'POST',
     *   queryParam: 'q',
     *   transformResponse: (data) => data.items
     * }}
     * ```
     */
    dynamic?: AutoCompleteDynamicOptions;
    
    /**
     * Legacy action prop (deprecated, use dynamic.action instead)
     * @deprecated Use dynamic.action instead
     */
    action?: string;
    
    /**
     * Custom styling for the autocomplete container
     */
    withStyle?: string;
    
    /**
     * Callback when a suggestion is selected
     */
    onSelect?: (value: string, item?: dynamic) => void;
    
    /**
     * Callback when input value changes
     */
    onChange?: (value: string) => void;
    
    /**
     * Callback when input value changes
     */
    clearOnSelect?: boolean;

    /**
     * When true, Enter commits the current input value as a string even if it
     * is not in the suggestion list. `onSelect` receives that string (and a
     * `{ [primaryDataKey]: value }` object, using the first `dataKey`). List
     * picks still send the matched item.
     */
    allowCustom?: boolean;
    
    /**
     * Custom renderer for suggestion items
     * Receives the suggestion string and index
     * For dynamic objects, item parameter contains the full object
     */
    renderOption?: (option: string, index: number, item?: dynamic) => React.ReactNode;
    
    /**
     * Placeholder for loading state
     * @default 'Loading...'
     */
    loadingPlaceholder?: string;
    
    /**
     * Placeholder when no results found
     * @default 'No results found'
     */
    emptyPlaceholder?: string;

    /**
     * Max Height
     */
    maxHeight?: number;
}
