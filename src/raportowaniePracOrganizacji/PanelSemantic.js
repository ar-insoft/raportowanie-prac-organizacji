import React from 'react';
import { Form, Button, Table, Container, Segment, Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './PanelSemantic.css'
import classNames from 'classnames/bind'
import _ from 'lodash'
import { Tlumaczenia } from '../tools/Tlumaczenia'
import { PracownikSearch} from "./PracownikSearch";
import { RodzajDropdown } from './RodzajDropdown'
import { RodzajQuery } from './RodzajQuery'
import { ZlecenieSearch } from './ZlecenieSearch' 
import { Dzien, GodzinaRozpoczecia, GodzinaZakonczenia } from "./DataIGodziny";
//import { StatusInfo } from "./StatusInfo";
//import { DatePicker, TimePicker } from 'antd';
//mport 'antd/dist/antd.css';
import { from } from 'rxjs';

export const PanelSemantic = ({ params, callbacks }) => {
    const { isLoading, pracownik, opis, moznaZapisac } = params;
    //const pracownikOdczytany = pracownik;
    //console.log('PanelSemantic callbacks', callbacks)
    return (
        <Container textAlign='center'>
            <Form autoComplete="off" loading={isLoading}>
                <Segment.Group>
                <Segment>
                    <Table celled striped>
                        <Table.Body>
                            <Table.Row key='pracownik'>
                                <Table.Cell width={1}>
                                    <Tlumaczenia id="Pracownik" />
                                </Table.Cell>
                                <Table.Cell width={10} className={classNames(
                                    {
                                        'niepoprawne_dane': false,
                                    })}>
                                    {/* {pracownikOdczytany ? raportujZlecenie.getEmployeeFulname() : <Tlumaczenia id="brak" />} */}
                                        <PracownikSearch params={params} callbacks={callbacks}/>
                                        {/* {_.get(pracownik, 'planDnia.zlecenie.index', '')} */}
                                </Table.Cell>
                            </Table.Row>
                                <Table.Row key='rodzaj'>
                                    <Table.Cell width={1}>
                                        <Tlumaczenia id="Rodzaj" />
                                    </Table.Cell>
                                    <Table.Cell width={3}>
                                        {/* <RodzajDropdown params={params} callbacks={callbacks} /> */}
                                        <RodzajQuery params={params} callbacks={callbacks} />
                                    </Table.Cell>
                                </Table.Row>
                            <Table.Row key='zlecenie'>
                                <Table.Cell width={1}>
                                    <Tlumaczenia id="Zlecenie" />
                                </Table.Cell>
                                <Table.Cell width={3} className={classNames(
                                    {
                                        'niepoprawne_dane': false,
                                    })}>
                                    {/* {zlecenieOdczytane ? raportujZlecenie.zlecenieOpis() : <Tlumaczenia id="brak" />} */}
                                        <ZlecenieSearch params={params} callbacks={callbacks}/>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='data'>
                                <Table.Cell>
                                        Data{/* <Tlumaczenia id="Data" /> */}
                                </Table.Cell>
                                <Table.Cell>
                                        <Dzien params={params} callbacks={callbacks} />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='godzina_start'>
                                <Table.Cell>
                                    Godzina rozpoczęcia
                                </Table.Cell>
                                <Table.Cell>
                                        <GodzinaRozpoczecia params={params} callbacks={callbacks} />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='data_czas'>
                                <Table.Cell>
                                        Godzina zakończenia
                                </Table.Cell>
                                <Table.Cell>
                                        <GodzinaZakonczenia params={params} callbacks={callbacks} />
                                </Table.Cell>
                            </Table.Row>
                                <Table.Row key='opis'>
                                    <Table.Cell width={1}>
                                        <Tlumaczenia id="Opis" />
                                    </Table.Cell>
                                    <Table.Cell width={3} className={classNames(
                                        {
                                            'niepoprawne_dane': false,
                                        })}>
                                        <Form.TextArea id='form-input-name'
                                            //label={fields.name.label}
                                            placeholder={'opis'}
                                            //autoFocus control={TextareaAutosize} rows={1}
                                            name='opis'
                                            value={opis}
                                            onChange={(e, data) => callbacks.ustawOpis(data.value)}
                                            //required={!readOnly}
                                            //readOnly={readOnly}
                                            //error={!isFieldValid(infrastructure.name, fields.name.validations, infrastructure)}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            <Table.Row key='zapisz'>
                                {/* <Table.Cell>
                                </Table.Cell> */}
                                    <Table.HeaderCell colSpan='2'>{/*  colSpan='2' */}
                                        {/* {moznaZapisac ? 'moznaZapisac' : 'NIEmoznaZapisac'} */}
                                        <Button color='teal' fluid size='large' disabled={!moznaZapisac} loading={isLoading} 
                                            onClick={(evt) => callbacks.zapiszPrace()}
                                            >Zapisz</Button>                                    
                                </Table.HeaderCell>
                            </Table.Row>
                            {/* <Table.Row key='prace'>
                                <Table.Cell>
                                    Prace pracownika
                                </Table.Cell>
                                <Table.Cell>
                                    {pracownikOdczytany
                                        ?
                                        <TrwajacePrace raportujZlecenie={raportujZlecenie}
                                            handlePrzerwijPrace={this.handlePrzerwijPrace}
                                            handleZakonczPrace={this.handleZakonczPrace} />
                                        : ''}
                                </Table.Cell>
                            </Table.Row> */}
                        </Table.Body>
                    </Table>
                </Segment>
                </Segment.Group>
            </Form>
        </Container >
    )
}

