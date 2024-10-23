import { z } from "zod";

export const TipoComuneModel = z.object({
  nameMunicipality: z.string(),
  istatCode: z.string(),
  acronymIstatProvince: z.string(),
  placeDescription: z.string(),
});
export type TipoComuneModel = z.infer<typeof TipoComuneModel>;

export const TipoLocalitaModel = z.object({
  placeDescription: z.string(),
  countryDescription: z.string(),
  codState: z.string(),
  provinceCounty: z.string(),
});
export type TipoLocalitaModel = z.infer<typeof TipoLocalitaModel>;

export const TipoLuogoNascitaModel = z.object({
  exceptionalPlace: z.string(),
  municipality: TipoComuneModel,
  place: TipoLocalitaModel,
});
export type TipoLuogoNascitaModel = z.infer<typeof TipoLuogoNascitaModel>;

export const TipoDataNascitaModel = z.object({
  eventDate: z.string(),
  birthPlace: TipoLuogoNascitaModel,
});
export type TipoDataNascitaModel = z.infer<typeof TipoDataNascitaModel>;

export const SoggettoModel = z.object({
  fiscalCode: z.string(),
  id: z.string(),
  surname: z.string(),
  name: z.string(),
  gender: z.string(),
  birthDate: TipoDataNascitaModel,
});
export type SoggettoModel = z.infer<typeof SoggettoModel>;

export const TipoToponimoModel = z.object({
  codType: z.string(),
  type: z.string(),
  originType: z.string(),
  toponymCod: z.string(),
  toponymDenomination: z.string(),
  toponymSource: z.string(),
});
export type TipoToponimoModel = z.infer<typeof TipoToponimoModel>;

export const TipoCivicoInternoModel = z.object({
  court: z.string(),
  stairs: z.string(),
  internal1: z.string(),
  espInternal1: z.string(),
  internal2: z.string(),
  espInternal2: z.string(),
  externalStairs: z.string(),
  secondary: z.string(),
  floor: z.string(),
  nui: z.string(),
  isolated: z.string(),
});
export type TipoCivicoInternoModel = z.infer<typeof TipoCivicoInternoModel>;

export const TipoNumeroCivicoModel = z.object({
  civicCod: z.string(),
  civicSource: z.string(),
  civicNumber: z.string(),
  metric: z.string(),
  progSNC: z.string(),
  letter: z.string(),
  exponent1: z.string(),
  color: z.string(),
  internalCivic: TipoCivicoInternoModel,
});
export type TipoNumeroCivicoModel = z.infer<typeof TipoNumeroCivicoModel>;

export const TipoIndirizzoModel = z.object({
  cap: z.string(),
  municipality: TipoComuneModel,
  fraction: z.string(),
  toponym: TipoToponimoModel,
  civicNumber: TipoNumeroCivicoModel,
});
export type TipoIndirizzoModel = z.infer<typeof TipoIndirizzoModel>;

export const TipoDatoLocalitaEsteraModel = z.object({
  placeDescription: z.string(),
  countryDescription: z.string(),
  countryState: z.string(),
  provinceCounty: z.string(),
});
export type TipoDatoLocalitaEsteraModel = z.infer<
  typeof TipoDatoLocalitaEsteraModel
>;

export const TipoToponimoEsteroModel = z.object({
  denomination: z.string(),
  civicNumber: z.string(),
});
export type TipoToponimoEsteroModel = z.infer<typeof TipoToponimoEsteroModel>;

export const TipoIndirizzoEsteroModel = z.object({
  cap: z.string(),
  place: TipoDatoLocalitaEsteraModel,
  toponym: TipoToponimoEsteroModel,
});
export type TipoIndirizzoEsteroModel = z.infer<typeof TipoIndirizzoEsteroModel>;

export const TipoConsolatoModel = z.object({
  consulateCod: z.string(),
  consulateDescription: z.string(),
});
export type TipoConsolatoModel = z.infer<typeof TipoConsolatoModel>;

export const TipoLocalitaEsteraModel = z.object({
  foreignAddress: TipoIndirizzoEsteroModel,
  consulate: TipoConsolatoModel,
});
export type TipoLocalitaEsteraModel = z.infer<typeof TipoLocalitaEsteraModel>;

export const TipoResidenzaModel = z.object({
  addressType: z.string(),
  noteaddress: z.string(),
  address: TipoIndirizzoModel,
  foreignState: TipoLocalitaEsteraModel,
  presso: z.string(),
  addressStartDate: z.string(),
});
export type TipoResidenzaModel = z.infer<typeof TipoResidenzaModel>;

export const UserModel = z.object({
  uuid: z.string(),
  subject: SoggettoModel,
  address: TipoResidenzaModel,
});
export type UserModel = z.infer<typeof UserModel>;

export const UserModelResponse = z
  .object({ uuid: z.string().uuid() })
  .partial()
  .passthrough();
// .and(UserModel);
export type UserModelResponse = z.infer<typeof UserModelResponse>;

export const UserModelFullResponse = z
  .object({
    uuid: z.string().uuid(),
    userModel: UserModel,
  })
  .partial()
  .passthrough()
  .and(UserModel);
export type UserModelFullResponse = z.infer<typeof UserModelFullResponse>;

/** ****************************************************************************** */
export const TipoDatiNascitaModel = z
  .object({
    dataEvento: z.string(),
    senzaGiorno: z.string(),
    senzaGiornoMese: z.string(),
    luogoNascita: TipoLuogoNascitaModel,
  })
  .partial()
  .passthrough();
export type TipoDatiNascitaModel = z.infer<typeof TipoDatiNascitaModel>;

export const TipoParametriRicercaModel = z
  .object({
    codiceFiscale: z.string(),
    id: z.string(),
    cognome: z.string(),
    senzaCognome: z.string(),
    nome: z.string(),
    senzaNome: z.string(),
    sesso: z.string(),
    datiNascita: TipoDatiNascitaModel,
  })
  .partial()
  .passthrough();
export type TipoParametriRicercaModel = z.infer<
  typeof TipoParametriRicercaModel
>;

export const TipoRichiestaModel = z
  .object({
    dateOfRequest: z.string(),
    motivation: z.string(),
    useCase: z.string(),
  })
  .passthrough();
export type TipoRichiestaModel = z.infer<typeof TipoRichiestaModel>;

export const TipoVerificaResidenzaModel = z
  .object({
    tipoIndirizzo: z.string(),
  })
  .passthrough();
export type TipoVerificaResidenzaModel = z.infer<
  typeof TipoVerificaResidenzaModel
>;

export const TipoVerificaModel = z
  .object({
    residenza: TipoVerificaResidenzaModel,
    indirizzo: TipoIndirizzoModel,
    localitaEstera: TipoLocalitaEsteraModel,
  })
  .passthrough();
export type TipoVerificaModel = z.infer<typeof TipoVerificaModel>;

export const RichiestaModel = z
  .object({
    idOperazioneClient: z.string(),
    parametriRicerca: TipoParametriRicercaModel,
    richiesta: TipoRichiestaModel,
    verifica: TipoVerificaModel,
  })
  .passthrough();
export type RichiestaModel = z.infer<typeof RichiestaModel>;

export const TipoCodiceFiscaleModel = z
  .object({
    codFiscale: z.string(),
    validitaCF: z.string(),
    dataAttribuzioneValidita: z.string(),
  })
  .partial()
  .passthrough();
export type TipoCodiceFiscaleModel = z.infer<typeof TipoCodiceFiscaleModel>;

export const TipoLuogoEventoModel = z
  .object({
    luogoEccezionale: z.string(),
    comune: TipoComuneModel,
    localita: TipoLocalitaModel,
  })
  .partial()
  .passthrough();
export type TipoLuogoEventoModel = z.infer<typeof TipoLuogoEventoModel>;

export const TipoIdSchedaSoggettoComuneModel = z
  .object({
    idSchedaSoggettoComuneIstat: z.string(),
    idSchedaSoggetto: z.string(),
  })
  .partial()
  .passthrough();
export type TipoIdSchedaSoggettoComuneModel = z.infer<
  typeof TipoIdSchedaSoggettoComuneModel
>;

export const TipoGeneralitaModel = z
  .object({
    codiceFiscale: TipoCodiceFiscaleModel,
    cognome: z.string(),
    senzaCognome: z.string(),
    nome: z.string(),
    senzaNome: z.string(),
    sesso: z.string(),
    dataNascita: z.string(),
    senzaGiorno: z.string(),
    senzaGiornoMese: z.string(),
    luogoNascita: TipoLuogoEventoModel,
    soggettoAIRE: z.string(),
    annoEspatrio: z.string(),
    idSchedaSoggettoComune: TipoIdSchedaSoggettoComuneModel,
    idSchedaSoggetto: z.string(),
    note: z.string(),
  })
  .partial()
  .passthrough();
export type TipoGeneralitaModel = z.infer<typeof TipoGeneralitaModel>;

export const TipoIdentificativiModel = z
  .object({
    id: z.string(),
  })
  .partial()
  .passthrough();
export type TipoIdentificativiModel = z.infer<typeof TipoIdentificativiModel>;

export const TipoAttoModel = z
  .object({
    comuneRegistrazione: TipoComuneModel,
    ufficioMunicipio: z.string(),
    anno: z.string(),
    parte: z.string(),
    serie: z.string(),
    numeroAtto: z.string(),
    volume: z.string(),
    dataFormazioneAtto: z.string(),
    trascritto: z.string(),
  })
  .partial()
  .passthrough();
export type TipoAttoModel = z.infer<typeof TipoAttoModel>;

export const TipoAttoANSCModel = z
  .object({
    idANSC: z.string(),
    comuneRegistrazione: TipoComuneModel,
    anno: z.string(),
    ufficioMunicipio: z.string(),
    numeroComunale: z.string(),
    dataFormazioneAtto: z.string(),
    trascritto: z.string(),
  })
  .partial()
  .passthrough();
export type TipoAttoANSCModel = z.infer<typeof TipoAttoANSCModel>;

export const TipoAttoEventoModel = z
  .object({
    atto: TipoAttoModel,
    attoANSC: TipoAttoANSCModel,
  })
  .partial()
  .passthrough();
export type TipoAttoEventoModel = z.infer<typeof TipoAttoEventoModel>;

export const TipoDatiEventoModel = z
  .object({
    dataEvento: z.string(),
    senzaGiorno: z.string(),
    senzaGiornoMese: z.string(),
    luogoEvento: TipoLuogoEventoModel,
    attoEvento: TipoAttoEventoModel,
  })
  .partial()
  .passthrough();
export type TipoDatiEventoModel = z.infer<typeof TipoDatiEventoModel>;

export const TipoDatiSoggettiEnteModel = z
  .object({
    generalita: TipoGeneralitaModel,
    residenza: z.array(TipoResidenzaModel),
    identificativi: TipoIdentificativiModel,
    datiDecesso: TipoDatiEventoModel,
  })
  .partial()
  .passthrough();
export type TipoDatiSoggettiEnteModel = z.infer<
  typeof TipoDatiSoggettiEnteModel
>;

export const TipoListaSoggettiModel = z
  .object({
    soggetto: z.array(TipoDatiSoggettiEnteModel),
  })
  .partial()
  .passthrough();
export type TipoListaSoggettiModel = z.infer<typeof TipoListaSoggettiModel>;

export const TipoErroriAnomaliaModel = z
  .object({
    codiceErroreAnomalia: z.string(),
    tipoErroreAnomalia: z.string(),
    testoErroreAnomalia: z.string(),
    oggettoErroreAnomalia: z.string(),
    campoErroreAnomalia: z.string(),
    valoreErroreAnomalia: z.string(),
  })
  .partial()
  .passthrough();
export type TipoErroriAnomaliaModel = z.infer<typeof TipoErroriAnomaliaModel>;

export const RispostaAR001Model = z
  .object({
    idOperazione: z.string(),
    soggetti: TipoDatiSoggettiEnteModel,
    listaAnomalie: z.array(TipoErroriAnomaliaModel),
  })
  .passthrough();

export type RispostaAR001Model = z.infer<typeof RispostaAR001Model>;

export const ProblemErrorModel = z
  .object({
    code: z.string(),
    detail: z.string(),
  })
  .partial()
  .passthrough();
export type ProblemErrorModel = z.infer<typeof ProblemErrorModel>;

export const ProblemModel = z
  .object({
    type: z.string(),
    status: z.number().int(),
    title: z.string(),
    correlationId: z.string().optional(),
    detail: z.string().optional(),
    errors: z.array(ProblemErrorModel).min(1),
  })
  .passthrough();
export type ProblemModel = z.infer<typeof ProblemModel>;

/*
export const schemas = {
    TipoComune,
    TipoLocalita,
    TipoLuogoNascitaE000,
    TipoDatiNascitaTemplateE000,
    TipoCriteriRicercaTemplateAR001,
    TipoToponimo,
    TipoCivicoInterno,
    TipoNumeroCivico,
    TipoIndirizzo,
    TipoDatoLocalitaEstera,
    TipoToponimoEstero,
    TipoIndirizzoEstero,
    TipoConsolato,
    TipoLocalitaEstera1,
    TipoResidenza,
      DataPreparationTemplate, -> userModel
      DataPreparationResponse, -> userModelResponse (solo uuid)
      DataPreparationTemplateResponse, userModelFullResponse uuid+userModel

    TipoDatiNascitaE000,
    TipoParametriRicercaAR001,
    TipoRichiestaAR001,
    RichiestaAR001,
    TipoCodiceFiscale,
    TipoLuogoEvento,
    TipoIdSchedaSoggettoComune,
    TipoGeneralita,
    TipoIdentificativi,
    TipoAtto,
    TipoAttoANSC,
    TipoAttoEvento,
    TipoDatiEvento,
    TipoDatiSoggettiEnte,
    TipoListaSoggetti,
    TipoErroriAnomalia,
    RispostaAR001,
    ProblemError,
  Problem,
};
*/
