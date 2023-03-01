import React from 'react';
import { Dropdown } from 'semantic-ui-react'
import classNames from 'classnames/bind'
import _ from 'lodash'

export const RodzajDropdown = ({ params, callbacks }) => {
    const { isLoading, rodzajLista, rodzaj, } = params;

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
            //error={invalidFields.find(o => o.name === 'possibilitiesToRent') !== undefined}
            />
        </div>

    )
}