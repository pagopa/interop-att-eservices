import { z } from "zod";

export const TipoComuneModel = z.object({
  nomeComune: z.string(),
  codiceIstat: z.string(),
  siglaProvinciaIstat: z.string(),
  descrizioneLocalita: z.string(),
});
export type TipoComuneModel = z.infer<typeof TipoComuneModel>;

export const TipoLocalitaModel = z.object({
  descrizioneLocalita: z.string(),
  descrizioneStato: z.string(),
  codiceStato: z.string(),
  provinciaContea: z.string(),
});
export type TipoLocalitaModel = z.infer<typeof TipoLocalitaModel>;

export const TipoLuogoNascitaModel = z.object({
  luogoEccezionale: z.string(),
  comune: TipoComuneModel,
  localita: TipoLocalitaModel,
});
export type TipoLuogoNascitaModel = z.infer<typeof TipoLuogoNascitaModel>;

export const TipoDataNascitaModel = z.object({
  dataEvento: z.string(),
  luogoNascita: TipoLuogoNascitaModel,
});
export type TipoDataNascitaModel = z.infer<typeof TipoDataNascitaModel>;

export const SoggettoModel = z.object({
  codiceFiscale: z.string(),
  id: z.string(),
  cognome: z.string(),
  nome: z.string(),
  sesso: z.string(),
  datiNascita: TipoDataNascitaModel,
});
export type SoggettoModel = z.infer<typeof SoggettoModel>;

export const TipoToponimoModel = z.object({
  codSpecie: z.string(),
  specie: z.string(),
  specieFonte: z.string(),
  codToponimo: z.string(),
  denominazioneToponimo: z.string(),
  toponimoFonte: z.string(),
});
export type TipoToponimoModel = z.infer<typeof TipoToponimoModel>;

export const TipoCivicoInternoModel = z.object({
  corte: z.string(),
  scala: z.string(),
  interno1: z.string(),
  espInterno1: z.string(),
  interno2: z.string(),
  espInterno2: z.string(),
  scalaEsterna: z.string(),
  secondario: z.string(),
  piano: z.string(),
  nui: z.string(),
  isolato: z.string(),
});
export type TipoCivicoInternoModel = z.infer<typeof TipoCivicoInternoModel>;

export const TipoNumeroCivicoModel = z.object({
  codiceCivico: z.string(),
  civicoFonte: z.string(),
  numero: z.string(),
  metrico: z.string(),
  progSNC: z.string(),
  lettera: z.string(),
  esponente1: z.string(),
  colore: z.string(),
  civicoInterno: TipoCivicoInternoModel,
});
export type TipoNumeroCivicoModel = z.infer<typeof TipoNumeroCivicoModel>;

export const TipoIndirizzoModel = z.object({
  cap: z.string(),
  comune: TipoComuneModel,
  frazione: z.string(),
  toponimo: TipoToponimoModel,
  numeroCivico: TipoNumeroCivicoModel,
});
export type TipoIndirizzoModel = z.infer<typeof TipoIndirizzoModel>;

export const TipoDatoLocalitaEsteraModel = z.object({
  descrizioneLocalita: z.string(),
  descrizioneStato: z.string(),
  codiceStato: z.string(),
  provinciaContea: z.string(),
});
export type TipoDatoLocalitaEsteraModel = z.infer<
  typeof TipoDatoLocalitaEsteraModel
>;

export const TipoToponimoEsteroModel = z.object({
  denominazione: z.string(),
  numeroCivico: z.string(),
});
export type TipoToponimoEsteroModel = z.infer<typeof TipoToponimoEsteroModel>;

export const TipoIndirizzoEsteroModel = z.object({
  cap: z.string(),
  localita: TipoDatoLocalitaEsteraModel,
  toponimo: TipoToponimoEsteroModel,
});
export type TipoIndirizzoEsteroModel = z.infer<typeof TipoIndirizzoEsteroModel>;

export const TipoConsolatoModel = z.object({
  codiceConsolato: z.string(),
  descrizioneConsolato: z.string(),
});
export type TipoConsolatoModel = z.infer<typeof TipoConsolatoModel>;

export const TipoLocalitaEsteraModel = z.object({
  indirizzoEstero: TipoIndirizzoEsteroModel,
  consolato: TipoConsolatoModel,
});
export type TipoLocalitaEsteraModel = z.infer<typeof TipoLocalitaEsteraModel>;

export const TipoResidenzaModel = z.object({
  tipoIndirizzo: z.string(),
  noteIndirizzo: z.string(),
  indirizzo: TipoIndirizzoModel,
  localitaEstera: TipoLocalitaEsteraModel,
  presso: z.string(),
  dataDecorrenzaResidenza: z.string(),
});
export type TipoResidenzaModel = z.infer<typeof TipoResidenzaModel>;

export const UserModel = z.object({
  uuid: z.string(),
  soggetto: SoggettoModel,
  residenza: TipoResidenzaModel,
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
    dataRiferimentoRichiesta: z.string(),
    motivoRichiesta: z.string(),
    casoUso: z.string(),
  })
  .passthrough();
export type TipoRichiestaModel = z.infer<typeof TipoRichiestaModel>;

export const TipoVerificaResidenzaModel = z
  .object({
    tipoIndirizzo: z.string(),
  })
  .passthrough();
export type TipoVerificaResidenzaModel = z.infer<typeof TipoVerificaResidenzaModel>;

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
