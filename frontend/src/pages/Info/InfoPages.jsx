import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseInfoPage from './BaseInfoPage';

export const PrivacyPolicyPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.privacy.title', 'Política de Privacitat')} 
      content={t('info.privacy.content', 'A INWINE ens prenem molt seriosament la teva privacitat. Aquesta pàgina detalla com recollim, utilitzem i protegim les teves dades personals.')}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.privacy.section1.title', "1. Recollida d'Informació")}</h2>
        <p>{t('info.privacy.section1.text', "Recollim informació quan et registres al nostre lloc, fas una comanda o et subscrius al nostre butlletí. La informació inclou el teu nom, correu electrònic i número de telèfon.")}</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.privacy.section2.title', "2. Ús de la Informació")}</h2>
        <p>{t('info.privacy.section2.text', "Qualsevol informació que recollim de tu pot ser utilitzada per:")}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t('info.privacy.section2.item1', 'Personalitzar la teva experiència.')}</li>
          <li>{t('info.privacy.section2.item2', 'Millorar el nostre lloc web i servei al client.')}</li>
          <li>{t('info.privacy.section2.item3', 'Processar transaccions i enviar correus electrònics periòdics.')}</li>
        </ul>
      </section>
    </BaseInfoPage>
  );
};

export const TermsOfUsePage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.terms.title', "Condicions d'Ús")} 
      content={t('info.terms.content', "Benvingut a INWINE. En accedir al nostre lloc web, acceptes complir aquestes condicions d'ús.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.terms.section1.title', "1. Ús de la Llicència")}</h2>
        <p>{t('info.terms.section1.text', "Es concedeix permís per descarregar temporalment una còpia dels materials al lloc web d'INWINE només per a visualització transitòria personal i no comercial.")}</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.terms.section2.title', "2. Exclusió de Responsabilitat")}</h2>
        <p>{t('info.terms.section2.text', "Els materials al lloc web d'INWINE es proporcionen \"tal com són\". INWINE no ofereix cap garantia, expressa o implícita.")}</p>
      </section>
    </BaseInfoPage>
  );
};

export const CookiesPolicyPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.cookies.title', "Política de Cookies")} 
      content={t('info.cookies.content', "Utilitzem cookies per millorar la teva experiència al nostre lloc web.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.cookies.what_are', "Què són les cookies?")}</h2>
        <p>{t('info.cookies.what_are_text', "Les cookies sont petits fitxers de text que s'emmagatzemen al teu dispositiu quan visites un lloc web per recordar les teves preferències.")}</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.cookies.types', "Tipus de cookies que utilitzem")}</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>{t('info.cookies.type_necessary', 'Necessàries:')}</strong> {t('info.cookies.type_necessary_text', 'Essencials per al funcionament del lloc.')}</li>
          <li><strong>{t('info.cookies.type_analysis', 'Anàlisi:')}</strong> {t('info.cookies.type_analysis_text', 'Per entendre com interactuen els usuaris amb el web.')}</li>
          <li><strong>{t('info.cookies.type_marketing', 'Màrqueting:')}</strong> {t('info.cookies.type_marketing_text', 'Per mostrar anuncis rellevants.')}</li>
        </ul>
      </section>
    </BaseInfoPage>
  );
};

export const LegalNoticePage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.legal.title', "Avís Legal")} 
      content={t('info.legal.content', "Informació legal obligatòria sobre el propietari d'aquest lloc web.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.legal.owner_data', "Dades del titular")}</h2>
        <p><strong>{t('info.legal.owner', 'Titular:')}</strong> INWINE S.L.</p>
        <p><strong>{t('info.legal.nif', 'NIF:')}</strong> B12345678</p>
        <p><strong>{t('info.legal.address', 'Domicili:')}</strong> Carrer del Sol, 1, 08201 Sabadell, Barcelona.</p>
        <p><strong>{t('info.legal.email', 'Email:')}</strong> legal@inwine.cat</p>
      </section>
    </BaseInfoPage>
  );
};

export const AboutUsPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.about.title', "Sobre nosaltres")} 
      content={t('info.about.content', "INWINE és la plataforma líder per connectar productors de vi, inversors i restaurants.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.about.mission', "La nostra missió")}</h2>
        <p>{t('info.about.mission_text', "Volem revolucionar el sector vinícola utilitzant la tecnologia per connectar l'excel·lència del camp amb la taula i el mercat d'inversió.")}</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.about.commitment', "El nostre compromís")}</h2>
        <p>{t('info.about.commitment_text', "Treballem amb transparència i passió per oferir la millor experiència a tota la nostra comunitat.")}</p>
      </section>
    </BaseInfoPage>
  );
};

export const TeamPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.team.title', "Equip")} 
      content={t('info.team.content', "Coneix les persones que fan possible INWINE.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.team.talent', "Talent i Passió")}</h2>
        <p>{t('info.team.talent_text', "El nostre equip està format per sommeliers, desenvolupadors i experts en finances, tots units per l'amor al vi.")}</p>
      </section>
    </BaseInfoPage>
  );
};

export const InfluencersPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.influencers.title', "Influencers")} 
      content={t('info.influencers.content', "Col·labora amb nosaltres i comparteix la teva passió pel vi.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.influencers.program', "Programa d'Ambaixadors")}</h2>
        <p>{t('info.influencers.program_text', "Busquem creadors de contingut que s'alineïn amb els nostres valors per portar la cultura del vi a noves audiències.")}</p>
      </section>
    </BaseInfoPage>
  );
};

export const AffiliatesPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.affiliates.title', "Afiliats")} 
      content={t('info.affiliates.content', "Uneix-te al nostre programa d'afiliats i guanya comissions.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.affiliates.benefits', "Beneficis per a socis")}</h2>
        <p>{t('info.affiliates.benefits_text', "Obtén ingressos recomanant els nostres serveis a la teva xarxa de contactes. Oferim les millors taxes del sector.")}</p>
      </section>
    </BaseInfoPage>
  );
};

export const MediaPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.media.title', "Mitjans")} 
      content={t('info.media.content', "Recursos per a premsa i mitjans de comunicació.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.media.press_kit', "Press Kit")}</h2>
        <p>{t('info.media.press_kit_text', "Pots descarregar el nostre dossier de premsa i material gràfic oficial directament des d'aquí.")}</p>
      </section>
    </BaseInfoPage>
  );
};

export const BlogPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.blog.title', "Blog")} 
      content={t('info.blog.content', "Últimes notícies, consells i curiositats sobre el món del vi.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.blog.explore', "Explora la cultura del vi")}</h2>
        <p>{t('info.blog.explore_text', "Contingut setmanal sobre cates, visites a cellers i les millors pràctiques per a inversors vitivinícoles.")}</p>
      </section>
    </BaseInfoPage>
  );
};

export const CommunityPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.community.title', "Comunitat")} 
      content={t('info.community.content', "Connecta amb altres amants del vi i inversors.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.community.network', "Xarxa INWINE")}</h2>
        <p>{t('info.community.network_text', "Participa en esdeveniments exclusius i comparteix coneixements amb altres professionals i entusiastes del sector.")}</p>
      </section>
    </BaseInfoPage>
  );
};

export const IdeasPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.ideas.title', "Idees")} 
      content={t('info.ideas.content', "Volem escoltar els teus suggeriments per millorar INWINE.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.ideas.co_creation', "Co-creació")}</h2>
        <p>{t('info.ideas.co_creation_text', "Les millors funcionalitats de la nostra plataforma han sorgit directament de les idees dels nostres usuaris.")}</p>
      </section>
    </BaseInfoPage>
  );
};

export const DevelopersPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.developers.title', "Desenvolupadors")} 
      content={t('info.developers.content', "Documentació i eines per integrar-te amb la nostra plataforma.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.developers.api', "API REST")}</h2>
        <p>{t('info.developers.api_text', "Accedeix a la nostra documentació tècnica per integrar dades de vins i mercats a les teves aplicacions.")}</p>
      </section>
    </BaseInfoPage>
  );
};

export const GuaranteePage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.guarantee.title', "Garantia")} 
      content={t('info.guarantee.content', "Informació sobre les garanties de producte i servei.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.guarantee.security', "Seguretat i Confiança")}</h2>
        <p>{t('info.guarantee.security_text', "Garantim l'autenticitat de tots els productes llistats a la nostra plataforma i la seguretat de les teves inversions.")}</p>
      </section>
    </BaseInfoPage>
  );
};

export const ProductDeclarationsPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage 
      title={t('info.product_declarations.title', "Declaracions de producte")} 
      content={t('info.product_declarations.content', "Certificacions i dades tècniques dels nostres vins.")}
    >
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('info.product_declarations.transparency', "Transparència Total")}</h2>
        <p>{t('info.product_declarations.transparency_text', "Tots els nostres vins compten amb declaracions nutricionals i de procedència detallades segons la normativa vigent.")}</p>
      </section>
    </BaseInfoPage>
  );
};
