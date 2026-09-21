import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Github, Linkedin, Mail } from 'lucide-react';
import BaseInfoPage from './BaseInfoPage';
import Seo from '@components/Seo';
import { openCookieSettings } from '@utils/cookieConsent';

// roleKey resolves against info.developers.<roleKey>
const PEOPLE = [
  {
    name: 'Pol Santandreu',
    roleKey: 'role_founder',
    featured: true,
    portfolio: 'https://www.polsantandreu.com',
  },
  {
    name: 'Pol González',
    roleKey: 'role_developer',
    portfolio: 'https://polgonzalez.me',
    github: 'https://github.com/pgonzaalez',
    linkedin: 'https://www.linkedin.com/in/pol-gonzalez/',
    email: 'pgmxx04@gmail.com',
  },
  {
    name: 'Juan Francisco Flores Fernández',
    roleKey: 'role_developer',
    portfolio: 'https://juanfloresfz.vercel.app',
    github: 'https://github.com/Juanfonsi',
  },
  {
    name: 'Hugo Romero',
    roleKey: 'role_developer',
    portfolio: 'https://portfoli-hugo.vercel.app',
    github: 'https://github.com/hache2212',
  },
  {
    name: 'Pau Martín Peralta',
    roleKey: 'role_developer',
    github: 'https://github.com/pau-mp',
  },
  {
    name: 'Ismael Rosillo',
    roleKey: 'role_developer',
    github: 'https://github.com/RosilloDev',
  },
];

const PersonCard = ({ person }) => {
  const { t } = useTranslation();
  const socials = [
    { href: person.portfolio, Icon: Globe, label: 'Portfolio' },
    { href: person.github, Icon: Github, label: 'GitHub' },
    { href: person.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { href: person.email ? `mailto:${person.email}` : null, Icon: Mail, label: 'Email' },
  ].filter((s) => s.href);

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border bg-white p-5 transition-all hover:shadow-md ${
        person.featured
          ? 'border-[#9A3E50]/40 ring-1 ring-[#9A3E50]/10'
          : 'border-gray-200 hover:border-[#9A3E50]/30'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900 leading-tight">{person.name}</p>
          <p className="text-sm text-[#9A3E50] mt-1">
            {t(`info.team.${person.roleKey}`, 'Desenvolupador')}
          </p>
        </div>
        {person.featured && (
          <span className="shrink-0 rounded-full bg-[#9A3E50]/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#9A3E50]">
            {t('info.team.founder_badge', 'Fundador')}
          </span>
        )}
      </div>
      {socials.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          {socials.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={`${label} · ${person.name}`}
              className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-[#9A3E50]/10 hover:text-[#9A3E50]"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

PersonCard.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    roleKey: PropTypes.string.isRequired,
    featured: PropTypes.bool,
    portfolio: PropTypes.string,
    github: PropTypes.string,
    linkedin: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

/** Renders an array of legal sections: { title, body: string[], items?: string[] }. */
const LegalSections = ({ nsKey, fallback = [] }) => {
  const { t } = useTranslation();
  const sections = t(`${nsKey}.sections`, { returnObjects: true, defaultValue: fallback });
  const list = Array.isArray(sections) ? sections : fallback;

  return (
    <>
      {list.map((section, i) => (
        <section key={i}>
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          {(section.body || []).map((paragraph, j) => (
            <p key={j} className="mb-3">{paragraph}</p>
          ))}
          {Array.isArray(section.items) && section.items.length > 0 && (
            <ul className="list-disc pl-6 space-y-2">
              {section.items.map((item, k) => (
                <li key={k}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </>
  );
};

const LastUpdated = ({ nsKey }) => {
  const { t } = useTranslation();
  const value = t(`${nsKey}.updated`, '27 d\'agost de 2026');
  return (
    <p className="text-sm text-gray-400 !mt-0 !mb-8">
      {t('info.last_updated_label', 'Última actualització')}: {value}
    </p>
  );
};

LegalSections.propTypes = {
  nsKey: PropTypes.string.isRequired,
  fallback: PropTypes.array,
};

LastUpdated.propTypes = {
  nsKey: PropTypes.string.isRequired,
};

export const PrivacyPolicyPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage
      title={t('info.privacy.title', 'Política de Privacitat')}
      content={t('info.privacy.content', 'A INWINE ens prenem seriosament la teva privacitat. Aquesta política explica quines dades personals tractem, amb quina finalitat i base jurídica, durant quant de temps i quins drets tens.')}
    >
      <Seo title={t('info.privacy.title', 'Política de Privacitat')} path="/privacitat" />
      <LastUpdated nsKey="info.privacy" />
      <LegalSections nsKey="info.privacy" />
    </BaseInfoPage>
  );
};

export const TermsOfUsePage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage
      title={t('info.terms.title', "Condicions d'Ús")}
      content={t('info.terms.content', "Aquestes condicions regulen l'accés i l'ús de la plataforma INWINE. En registrar-te o utilitzar el lloc web acceptes aquestes condicions en la seva totalitat.")}
    >
      <Seo title={t('info.terms.title', "Condicions d'Ús")} path="/condicions" />
      <LastUpdated nsKey="info.terms" />
      <LegalSections nsKey="info.terms" />
    </BaseInfoPage>
  );
};

export const CookiesPolicyPage = () => {
  const { t } = useTranslation();
  const table = t('info.cookies.table', { returnObjects: true, defaultValue: [] });
  const rows = Array.isArray(table) ? table : [];

  return (
    <BaseInfoPage
      title={t('info.cookies.title', 'Política de Cookies')}
      content={t('info.cookies.content', "Aquest lloc web utilitza cookies pròpies i de tercers per garantir-ne el funcionament, recordar les teves preferències i analitzar-ne l'ús. Aquí t'expliquem quines fem servir i com pots gestionar-les.")}
    >
      <Seo title={t('info.cookies.title', 'Política de Cookies')} path="/cookies" />
      <LastUpdated nsKey="info.cookies" />
      <LegalSections nsKey="info.cookies" />

      {rows.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">
            {t('info.cookies.table_title', 'Cookies que utilitzem')}
          </h2>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b-2 border-gray-200">
                  <th className="py-2 px-2 font-semibold">{t('info.cookies.col_name', 'Cookie')}</th>
                  <th className="py-2 px-2 font-semibold">{t('info.cookies.col_provider', 'Proveïdor')}</th>
                  <th className="py-2 px-2 font-semibold">{t('info.cookies.col_purpose', 'Finalitat')}</th>
                  <th className="py-2 px-2 font-semibold">{t('info.cookies.col_duration', 'Durada')}</th>
                  <th className="py-2 px-2 font-semibold">{t('info.cookies.col_category', 'Categoria')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 align-top">
                    <td className="py-2 px-2 font-mono text-[13px] text-gray-900 whitespace-nowrap">{row.name}</td>
                    <td className="py-2 px-2">{row.provider}</td>
                    <td className="py-2 px-2">{row.purpose}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{row.duration}</td>
                    <td className="py-2 px-2">{row.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-4">
          {t('info.cookies.manage_title', 'Com gestionar les teves preferències')}
        </h2>
        <p className="mb-4">
          {t('info.cookies.manage_text', "Pots acceptar, rebutjar o configurar les cookies no essencials en qualsevol moment des del panell de preferències. També pots esborrar-les o bloquejar-les des de la configuració del teu navegador.")}
        </p>
        <button
          type="button"
          onClick={openCookieSettings}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-[#9A3E50] text-white text-sm font-bold rounded-xl hover:bg-[#853545] transition-all not-prose"
        >
          {t('info.cookies.manage_button', 'Configurar cookies')}
        </button>
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
      title={t('info.about.title', 'Sobre nosaltres')}
      content={t(
        'info.about.content',
        "INWINE és una plataforma que connecta cellers, restaurants i inversors del món del vi. Neix d'una idea de Pol Santandreu i l'ha desenvolupada un equip apassionat per la tecnologia i el vi.",
      )}
    >
      <Seo title={t('info.about.title', 'Sobre nosaltres')} path="/sobre-nosaltres" />
      <LegalSections nsKey="info.about" />
    </BaseInfoPage>
  );
};

export const TeamPage = () => {
  const { t } = useTranslation();
  return (
    <BaseInfoPage
      title={t('info.team.title', 'Equip')}
      content={t('info.team.content', 'Les persones que han fet possible INWINE.')}
    >
      <Seo title={t('info.team.title', 'Equip')} path="/equip" />
      <LegalSections nsKey="info.team" />
      <section className="not-prose">
        <div className="grid gap-4 sm:grid-cols-2">
          {PEOPLE.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </div>
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

// The developer / team / project info now lives in the Empresa section pages
// (/sobre-nosaltres and /equip). Keep this route as a redirect for old links.
export const DevelopersPage = () => <Navigate to="/sobre-nosaltres" replace />;

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
