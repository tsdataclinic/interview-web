import React from 'react';
import { QuizQuestion } from './QuizQuestion';
import { ResponseData } from '@dataclinic/interview';
import ApartmentIcon from '@material-ui/icons/Apartment';
import TrainIcon from '@material-ui/icons/Train';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import WifiIcon from '@material-ui/icons/Wifi';
import PeopleIcon from '@material-ui/icons/People';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import HelpIcon from '@material-ui/icons/Help';
import HouseIcon from '@material-ui/icons/House';
import CheckIcon from '@material-ui/icons/Check';
import { phrases } from './Phrases';
import { SupportedLanguage } from './SupportedLanguage';

export const webModeratorConfig = (
    data: ResponseData,
    lang: SupportedLanguage
) => ({});
