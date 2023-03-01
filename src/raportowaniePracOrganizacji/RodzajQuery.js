import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Dropdown } from 'semantic-ui-react'
import classNames from 'classnames/bind'
import _ from 'lodash'
import { consts, DataProvider } from './DataProvider'

export const RodzajQuery = ({ params, callbacks }) => {
    const { rodzaj, aaa} = params;
    const query = useQuery(['rodzajLista'], DataProvider.fetchRodzajLista)
    const { isLoading, isError, data, error } = query
    const rodzajLista = data
    //console.log('RodzajQuery', query)

    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !rodzaj,
            })}>
            <Dropdown className='search_field'
                name='rodzaj'
                id='rodzaj_select'
                placeholder='Wybierz rodzaj'
                //fluid
                selection
                options={rodzajLista}
                value={rodzaj}
                onChange={(e, dropdownData) => callbacks.wybierzRodzaj(dropdownData.value)}
                error={query.status === 'error'}
            />
        </div>

    )
}