import { DatePicker, TimePicker } from 'antd';
import 'antd/dist/antd.css';
import classNames from 'classnames/bind'
import moment from 'moment';
import { StatusInfo } from "./StatusInfo";

export const Dzien = ({ params, callbacks }) => {
    const { data, refDate } = params;
    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !data,
            })}>
            <DatePicker id='dzien_picker' bordered={false} placeholder='Wybierz datę' ref={refDate}
                value={data}
                onChange={(date, dateString) => callbacks.wybierzDate(date)} 
                />
            <StatusInfo poprawneDane={data} />
        </div>
    )
}

export const GodzinaRozpoczecia = ({ params, callbacks }) => {
    const { godzinaStart, godzinaEnd, przepracowano } = params;

    const handleGodzinaRozpoczecia = (czas) => {
        if (!moment.isMoment(czas)) {
            callbacks.wybierzGodzineRozpoczecia(null)
            callbacks.wybierzPrzepracowano(momentZERO())
            return
        }
        const czasNormalized = normalizeTime(czas)
        callbacks.wybierzGodzineRozpoczecia(czasNormalized)
        if (czasNormalized && godzinaEnd) {
            if (czasNormalized.isAfter(godzinaEnd)) {
                callbacks.wybierzGodzineZakonczenia(czasNormalized);
                callbacks.wybierzPrzepracowano(momentZERO())
            } else {
                callbacks.wybierzPrzepracowano(wyliczPrzepracowano(czasNormalized, godzinaEnd))
            }
            return
        }
        if (czasNormalized && przepracowano) {
            callbacks.wybierzGodzineZakonczenia(wyliczCzasZakonczenia(czasNormalized, przepracowano))
        }
    }

    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !godzinaStart,
            })}>
            <TimePicker bordered={false} format='HH:mm' placeholder='rozpoczęcie' showNow={false} 
                //disabledHours={() => disabledHours(data)}
                onSelect={handleGodzinaRozpoczecia}
                onChange={handleGodzinaRozpoczecia}
                value={godzinaStart} />
            <StatusInfo poprawneDane={godzinaStart} />
            {/* {godzinaStart && godzinaStart.format("yyyy-MM-DD HH:mm:ss")}{' start'}
                                            <br />{godzinaEnd && godzinaEnd.format("yyyy-MM-DD HH:mm:ss")}{' end'} 
                                            <br />{przepracowano && przepracowano.format("yyyy-MM-DD HH:mm:ss")}{' przepracowano'} */}
        </div>
    )
}

export const GodzinaZakonczenia = ({ params, callbacks }) => {
    const { godzinaStart, godzinaEnd, przepracowano } = params;
    const format = 'HH:mm';

    const handleGodzinaZakonczenia = (czas) => {
        zmianaGodzinaZakonczenia(czas, { params, callbacks })
    }

    const handlePrzepracowano = (czas) => {
        if (!moment.isMoment(czas)) {
            callbacks.wybierzPrzepracowano(momentZERO())
            return
        }
        const czasNormalized = normalizeTime(czas) //moment("2021-01-01 " + czas.format("HH:mm"), "yyyy-MM-DD HH:mm")
        callbacks.wybierzPrzepracowano(czasNormalized)
        if (godzinaStart && czasNormalized) {
            callbacks.wybierzGodzineZakonczenia(wyliczCzasZakonczenia(godzinaStart, czasNormalized))
            return;
        }
        if (godzinaEnd && czasNormalized) {
            callbacks.wybierzGodzineRozpoczecia(wyliczCzasRozpoczecia(godzinaEnd, czasNormalized));
        }
    }

    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !godzinaEnd,
            })}>
            <TimePicker bordered={false} format={format} placeholder='zakończenie'
                //disabledHours={() => disabledHours(data)}
                onSelect={handleGodzinaZakonczenia}
                onChange={handleGodzinaZakonczenia} value={godzinaEnd} />
                lub po przepracowaniu
            <TimePicker bordered={false} format={format} showNow={false} suffixIcon={null} allowClear={false} placeholder='godz:min'
                disabledMinutes={przepracowanoDisabledMinutes}
                onSelect={handlePrzepracowano}
                onChange={handlePrzepracowano} value={przepracowano} />
            <StatusInfo poprawneDane={godzinaEnd} />
        </div>
    )
}

/**
 * Formatuje parametry wejściowe i ustawia kontrolki czasu.
 * @param {string} godzinaRozpoczecia - godzina rozpoczęcia w formacie HH:mm:ss.
 * @param {string} godzinaZakonczenia - godzina zakończenia w formacie HH:mm:ss.
 * @param {object} object - obiekt zawierający {params, callbacks} wysyłany do Komponentów.
 */
export const ustawGodzinyRopoczeciaZakonczenia = (godzinaRozpoczecia, godzinaZakonczenia, { params, callbacks }) => {
    const start = moment("2021-01-01 " + godzinaRozpoczecia, "yyyy-MM-DD HH:mm:ss")
    const end = moment("2021-01-01 " + godzinaZakonczenia, "yyyy-MM-DD HH:mm:ss")

    callbacks.wybierzGodzineRozpoczecia(start)
    const parametry = { godzinaStart: start, przepracowano: null }
    zmianaGodzinaZakonczenia(end, { params: parametry, callbacks})
}

const zmianaGodzinaZakonczenia = (godzinaEnd, { params, callbacks }) => {
    const { godzinaStart, przepracowano } = params;
    if (!moment.isMoment(godzinaEnd)) {
        callbacks.wybierzGodzineZakonczenia(null)
        callbacks.wybierzPrzepracowano(momentZERO())
        return
    }
    const czasNormalized = normalizeTime(godzinaEnd)
    callbacks.wybierzGodzineZakonczenia(czasNormalized)
    if (godzinaStart && czasNormalized) {
        if (czasNormalized.isBefore(godzinaStart)) {
            callbacks.wybierzGodzineRozpoczecia(czasNormalized);
            callbacks.wybierzPrzepracowano(momentZERO())
        } else {
            callbacks.wybierzPrzepracowano(wyliczPrzepracowano(godzinaStart, czasNormalized))
        }
        return
    }
    if (czasNormalized && przepracowano) {
        callbacks.wybierzGodzineRozpoczecia(wyliczCzasRozpoczecia(czasNormalized, przepracowano));
    }
}

function momentZERO() {
    return moment("2021-01-01 00:00", "yyyy-MM-DD HH:mm")
}
function normalizeTime(timeMoment) {
    return moment("2021-01-01 " + timeMoment.format("HH:mm"), "yyyy-MM-DD HH:mm")
}

function wyliczCzasRozpoczecia(end, przepracowano) {
    if (end && przepracowano) {
        const diff = moment.duration(przepracowano.diff(momentZERO()))
        const rozpoczeto = moment(end).subtract(diff.asMinutes(), 'minutes')
        return rozpoczeto
    }
    return end
}
function wyliczCzasZakonczenia(start, przepracowano) {
    if (start && przepracowano) {
        const diff = moment.duration(przepracowano.diff(momentZERO()))
        const zakonczono = moment(start).add(diff.asMinutes(), 'minutes')
        return zakonczono
    }
    return start
}
function wyliczPrzepracowano(start, end) {
    if (start && end) {
        const diff = moment.duration(end.diff(start))
        const przepracowano = momentZERO().add(diff.asMinutes(), 'minutes')
        return przepracowano
    }
    return momentZERO()
}

function przepracowanoDisabledMinutes(selectedHour) {
    if (selectedHour === 0) return [0,1];
    return [];
}

/**
 * Test if time is after now.
 * @param {moment} dzien - The Moment object containing testing date.
 * @param {moment} czas - The Moment object containing testing time.
 * @return {boolean} True if dzien + czas is after now
 */
function godzinaPozniejszaOdBiezacej(dzien, czas) {
    if (!moment.isMoment(dzien) || !moment.isMoment(czas)) return false
    const now = moment()
    return now.isBefore(moment(dzien.format("yyyy-MM-DD") + " " + czas.format("HH:mm")))
}