import React from 'react';
import BaseInfoPage from './BaseInfoPage';

export const PrivacyPolicyPage = () => (
  <BaseInfoPage 
    title="Política de Privacitat" 
    content="A INWINE ens prenem molt seriosament la teva privacitat. Aquesta pàgina detalla com recollim, utilitzem i protegim les teves dades personals."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">1. Recollida d'Informació</h2>
      <p>Recollim informació quan et registres al nostre lloc, fas una comanda o et subscrius al nostre butlletí. La informació inclou el teu nom, correu electrònic i número de telèfon.</p>
    </section>
    <section>
      <h2 className="text-2xl font-bold mb-4">2. Ús de la Informació</h2>
      <p>Qualsevol informació que recollim de tu pot ser utilitzada per:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Personalitzar la teva experiència.</li>
        <li>Millorar el nostre lloc web i servei al client.</li>
        <li>Processar transaccions i enviar correus electrònics periòdics.</li>
      </ul>
    </section>
  </BaseInfoPage>
);

export const TermsOfUsePage = () => (
  <BaseInfoPage 
    title="Condicions d'Ús" 
    content="Benvingut a INWINE. En accedir al nostre lloc web, acceptes complir aquestes condicions d'ús."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">1. Ús de la Llicència</h2>
      <p>Es concedeix permís per descarregar temporalment una còpia dels materials al lloc web d'INWINE només per a visualització transitòria personal i no comercial.</p>
    </section>
    <section>
      <h2 className="text-2xl font-bold mb-4">2. Exclusió de Responsabilitat</h2>
      <p>Els materials al lloc web d'INWINE es proporcionen "tal com són". INWINE no ofereix cap garantia, expressa o implícita.</p>
    </section>
  </BaseInfoPage>
);

export const CookiesPolicyPage = () => (
  <BaseInfoPage 
    title="Política de Cookies" 
    content="Utilitzem cookies per millorar la teva experiència al nostre lloc web."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">Què són les cookies?</h2>
      <p>Les cookies són petits fitxers de text que s'emmagatzemen al teu dispositiu quan visites un lloc web per recordar les teves preferències.</p>
    </section>
    <section>
      <h2 className="text-2xl font-bold mb-4">Tipus de cookies que utilitzem</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Necessàries:</strong> Essencials per al funcionament del lloc.</li>
        <li><strong>Anàlisi:</strong> Per entendre com interactuen els usuaris amb el web.</li>
        <li><strong>Màrqueting:</strong> Per mostrar anuncis rellevants.</li>
      </ul>
    </section>
  </BaseInfoPage>
);

export const LegalNoticePage = () => (
  <BaseInfoPage 
    title="Avís Legal" 
    content="Informació legal obligatòria sobre el propietari d'aquest lloc web."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">Dades del titular</h2>
      <p><strong>Titular:</strong> INWINE S.L.</p>
      <p><strong>NIF:</strong> B12345678</p>
      <p><strong>Domicili:</strong> Carrer del Sol, 1, 08201 Sabadell, Barcelona.</p>
      <p><strong>Email:</strong> legal@inwine.cat</p>
    </section>
  </BaseInfoPage>
);

export const AboutUsPage = () => (
  <BaseInfoPage 
    title="Sobre nosaltres" 
    content="INWINE és la plataforma líder per connectar productors de vi, inversors i restaurants."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">La nostra missió</h2>
      <p>Volem revolucionar el sector vinícola utilitzant la tecnologia per connectar l'excel·lència del camp amb la taula i el mercat d'inversió.</p>
    </section>
    <section>
      <h2 className="text-2xl font-bold mb-4">El nostre compromís</h2>
      <p>Treballem amb transparència i passió per oferir la millor experiència a tota la nostra comunitat.</p>
    </section>
  </BaseInfoPage>
);

export const TeamPage = () => (
  <BaseInfoPage 
    title="Equip" 
    content="Coneix les persones que fan possible INWINE."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">Talent i Passió</h2>
      <p>El nostre equip està format per sommeliers, desenvolupadors i experts en finances, tots units per l'amor al vi.</p>
    </section>
  </BaseInfoPage>
);

export const InfluencersPage = () => (
  <BaseInfoPage 
    title="Influencers" 
    content="Col·labora amb nosaltres i comparteix la teva passió pel vi."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">Programa d'Ambaixadors</h2>
      <p>Busquem creadors de contingut que s'alineïn amb els nostres valors per portar la cultura del vi a noves audiències.</p>
    </section>
  </BaseInfoPage>
);

export const AffiliatesPage = () => (
  <BaseInfoPage 
    title="Afiliats" 
    content="Uneix-te al nostre programa d'afiliats i guanya comissions."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">Beneficis per a socis</h2>
      <p>Obtén ingressos recomanant els nostres serveis a la teva xarxa de contactes. Oferim les millors taxes del sector.</p>
    </section>
  </BaseInfoPage>
);

export const MediaPage = () => (
  <BaseInfoPage 
    title="Mitjans" 
    content="Recursos per a premsa i mitjans de comunicació."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">Press Kit</h2>
      <p>Pots descarregar el nostre dossier de premsa i material gràfic oficial directament des d'aquí.</p>
    </section>
  </BaseInfoPage>
);

export const BlogPage = () => (
  <BaseInfoPage 
    title="Blog" 
    content="Últimes notícies, consells i curiositats sobre el món del vi."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">Explora la cultura del vi</h2>
      <p>Contingut setmanal sobre cates, visites a cellers i les millors pràctiques per a inversors vitivinícoles.</p>
    </section>
  </BaseInfoPage>
);

export const CommunityPage = () => (
  <BaseInfoPage 
    title="Comunitat" 
    content="Connecta amb altres amants del vi i inversors."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">Xarxa INWINE</h2>
      <p>Participa en esdeveniments exclusius i comparteix coneixements amb altres professionals i entusiastes del sector.</p>
    </section>
  </BaseInfoPage>
);

export const IdeasPage = () => (
  <BaseInfoPage 
    title="Idees" 
    content="Volem escoltar els teus suggeriments per millorar INWINE."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">Co-creació</h2>
      <p>Les millors funcionalitats de la nostra plataforma han sorgit directament de les idees dels nostres usuaris.</p>
    </section>
  </BaseInfoPage>
);

export const DevelopersPage = () => (
  <BaseInfoPage 
    title="Desenvolupadors" 
    content="Documentació i eines per integrar-te amb la nostra plataforma."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">API REST</h2>
      <p>Accedeix a la nostra documentació tècnica per integrar dades de vins i mercats a les teves aplicacions.</p>
    </section>
  </BaseInfoPage>
);

export const GuaranteePage = () => (
  <BaseInfoPage 
    title="Garantia" 
    content="Informació sobre les garanties de producte i servei."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">Seguretat i Confiança</h2>
      <p>Garantim l'autenticitat de tots els productes llistats a la nostra plataforma i la seguretat de les teves inversions.</p>
    </section>
  </BaseInfoPage>
);

export const ProductDeclarationsPage = () => (
  <BaseInfoPage 
    title="Declaracions de producte" 
    content="Certificacions i dades tècniques dels nostres vins."
  >
    <section>
      <h2 className="text-2xl font-bold mb-4">Transparència Total</h2>
      <p>Tots els nostres vins compten amb declaracions nutricionals i de procedència detallades segons la normativa vigent.</p>
    </section>
  </BaseInfoPage>
);
