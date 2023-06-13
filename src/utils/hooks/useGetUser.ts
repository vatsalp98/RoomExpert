import {useEffect, useReducer} from "react";
import {Account} from "appwrite";
import {client} from "~/utils/utils";

export const FetchState = {
    FETCH_INIT: 0,
    FETCH_SUCCESS: 1,
    FETCH_FAILURE: 2,
};

export const useGetUser = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const reducer = (state, action) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        switch (action.type) {
            case FetchState.FETCH_INIT:
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return {...state, isLoading: true, isError: false};
            case FetchState.FETCH_SUCCESS:
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                    user: action.payload,
                };
            case FetchState.FETCH_FAILURE:
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return {...state, isLoading: false, isError: true};
            default:
                throw new Error();
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [state, dispatch] = useReducer(reducer, {
        isLoading: false,
        isError: true,
        data: [],
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useEffect(() => {
        let didCancel = false;
        const getTodos = async () => {
            dispatch({type: FetchState.FETCH_INIT});
            try {
                const account = new Account(client);
                const account_payload = await account.get();
                if (!didCancel) {
                    dispatch({type: FetchState.FETCH_SUCCESS, payload: account_payload});
                }
            } catch (e) {
                if (!didCancel) {
                    dispatch({type: FetchState.FETCH_FAILURE});
                }
            }
        };
        void getTodos();
        return () => (didCancel = true);
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return [state, dispatch];
};