import type { BiomeId, MovementId, Species } from '../types';

const s = (id: string, name: string, biomeId: BiomeId, movement: MovementId, bounds: Species['bounds'], speed: [number, number], pause: [number, number], size: [number, number], trail: string, reaction: string, motionDescription: string): Species => ({ id, name, biomeId, movement, bounds, speed, pause, size, trail, reaction, motionDescription, facing: movement === 'orbit' ? 'none' : 'horizontal' });

export const speciesRegistry: Species[] = [
  s('fish','Balık','ocean','swim','water',[28,55],[.3,1.6],[.75,1.15],'bubble','flee','S kıvrımlarıyla yüzer, dokununca hızla kaçar.'),
  s('seahorse','Denizatı','ocean','hover','water',[12,25],[.8,2.4],[.6,.9],'bubble','spiral','Dik süzülür ve küçük spiraller çizer.'),
  s('jellyfish','Denizanası','ocean','pulse','water',[8,18],[.3,1.2],[.7,1.15],'bubble','pulse','Ritmik nabızlarla akıntıda yükselir.'),
  s('octopus','Ahtapot','ocean','jet','water',[20,48],[.7,2.1],[.8,1.2],'ink','flee','Kısa püskürmelerle ilerler, esneyip toparlanır.'),
  s('sea_turtle','Deniz kaplumbağası','ocean','glide','water',[13,28],[.5,1.7],[.9,1.3],'bubble','turn','Geniş ve yavaş yaylarla süzülür.'),
  s('cat','Kedi','forest','walk','ground',[15,29],[1.2,3.8],[.7,1.05],'dust','sit','Yürür, durur, bazen oturup çevresine bakar.'),
  s('rabbit','Tavşan','forest','hop','ground',[20,42],[.5,1.8],[.6,.9],'dust','hop','Ritmik sıçrayışlarla çayırda dolaşır.'),
  s('fox','Tilki','forest','walk','ground',[19,35],[.8,2.4],[.75,1.05],'leaf','look','Temkinli dolaşır, durup çevreyi dinler.'),
  s('butterfly','Kelebek','forest','flutter','air',[17,36],[.1,.7],[.35,.58],'spark','flutter','Zigzag ve sekiz biçimli hafif uçuş yapar.'),
  s('owl','Baykuş','forest','glide','air',[22,39],[1.7,4.2],[.65,.95],'feather','turn','Kısa uçuşlarla dallar arasında yer değiştirir.'),
  s('camel','Deve','desert','walk','ground',[10,19],[1,2.8],[.9,1.35],'dust','look','Ağır, salınan adımlarla kumda yürür.'),
  s('scorpion','Akrep','desert','sprint','ground',[24,52],[.8,2.2],[.42,.68],'dust','flee','Kısa zikzak koşular ve ani beklemeler yapar.'),
  s('lizard','Kertenkele','desert','sprint','ground',[33,68],[1.1,3.2],[.4,.7],'dust','freeze','Birden hızlanır, sonra tamamen donar.'),
  s('fennec','Çöl tilkisi','desert','walk','ground',[23,42],[.8,2.3],[.62,.9],'dust','look','Hafifçe koşar ve merakla durup bakar.'),
  s('dune_beetle','Çöl böceği','desert','patrol','ground',[12,26],[.4,1.6],[.3,.5],'dust','turn','Kısa sürünür, keskin dönüşlerle yön değiştirir.'),
  s('bird','Kuş','sky','glide','air',[28,52],[.2,1.2],[.55,.85],'feather','flutter','Kanat ritmiyle yükselir ve uzun süzülür.'),
  s('tiny_dragon','Minik ejderha','sky','flutter','air',[25,46],[.4,1.3],[.65,1.05],'spark','flee','Geniş, dalgalı bir uçuş rotası izler.'),
  s('flying_balloon','Uçan balon','sky','hover','air',[8,17],[.2,.8],[.65,1.05],'none','bob','Rüzgârla yükselir, yumuşakça salınır.'),
  s('flying_cat','Uçan kedi','sky','hover','air',[14,27],[.5,1.8],[.65,.95],'cloud','wave','Havada kalır ve yüzer gibi ilerler.'),
  s('paper_plane','Kâğıt uçak','sky','glide','air',[34,62],[.1,.6],[.5,.85],'wind','turn','Geniş süzülür, zarif ve hızlı dönüşler yapar.'),
  s('city_cat','Şehir kedisi','city','walk','ground',[15,29],[1.1,3.5],[.65,.95],'dust','sit','Sokakta gezer, kaldırımda oturur.'),
  s('dog','Köpek','city','walk','ground',[20,38],[.7,2.2],[.7,1.05],'dust','greet','Trottan duruşa geçer ve neşeyle selamlar.'),
  s('pigeon','Güvercin','city','hop','ground',[16,36],[.4,1.6],[.45,.7],'feather','flutter','Yerde sekerek ilerler, kısa uçuşlar yapar.'),
  s('robot','Robot','city','patrol','ground',[14,29],[.5,1.8],[.55,.9],'spark','wave','Köşeli devriye yapar ve dokununca selam verir.'),
  s('car','Araba','city','patrol','road',[35,62],[.2,.7],[.65,1.1],'dust','honk','Hazır yol şeritlerini izleyerek döner.'),
  s('alien','Uzaylı','space','hop','ground',[13,27],[.6,2.1],[.55,.9],'spark','hop','Düşük yerçekiminde uzun sıçrayışlar yapar.'),
  s('rocket','Roket','space','jet','space',[30,78],[.5,1.5],[.65,1.05],'thrust','boost','İvmelenerek uçar ve kâğıt itki izi bırakır.'),
  s('planet','Gezegen','space','orbit','space',[3,8],[0,0],[.8,1.3],'spark','spin','Yavaşça döner, küçük bir yörüngede salınır.'),
  s('satellite','Uydu','space','orbit','space',[14,25],[0,0],[.45,.75],'signal','spin','Eliptik yörüngede düzenli biçimde dolaşır.'),
  s('space_cat','Uzay kedisi','space','hover','space',[10,22],[.2,1.1],[.6,.95],'spark','spin','Yerçekimsiz süzülür ve yavaşça döner.'),
  s('penguin','Penguen','polar','slide','ground',[15,34],[.7,2.2],[.55,.85],'snow','slide','Paytak yürür, arada karnının üstünde kayar.'),
  s('seal','Fok','polar','slide','ground',[18,37],[.8,2.6],[.65,1],'snow','slide','Buz üzerinde kısa kaymalarla ilerler.'),
  s('polar_bear','Kutup ayısı','polar','walk','ground',[9,18],[1.1,3.1],[.9,1.35],'snow','look','Buzda ağır ve dengeli adımlarla yürür.'),
  s('arctic_fox','Kutup tilkisi','polar','walk','ground',[20,38],[.7,2.1],[.55,.85],'snow','flee','Kar üzerinde hafif ve sessizce koşar.'),
  s('snow_hare','Kar tavşanı','polar','hop','ground',[22,43],[.5,1.7],[.5,.8],'snow','hop','Zıplar ve ardında kısa kar izleri bırakır.'),
  s('bat','Yarasa','cave','flutter','air',[29,55],[.15,.8],[.45,.75],'echo','flutter','Döngüsel uçar, bazen tavana yaklaşır.'),
  s('spider','Örümcek','cave','patrol','wall',[17,36],[.5,1.9],[.32,.55],'web','flee','Kısa sürünür, duvarlarda keskin dönüş yapar.'),
  s('firefly','Ateşböceği','cave','pulse','air',[8,20],[.1,.7],[.25,.42],'glow','pulse','Rastlantısal yumuşak uçuş ve ışık nabzı yapar.'),
  s('cave_salamander','Mağara semenderi','cave','walk','ground',[8,17],[.8,2.4],[.45,.72],'none','freeze','Yavaşça sürünür ve uzun aralar verir.'),
  s('cave_beetle','Mağara böceği','cave','sprint','ground',[14,31],[.5,1.8],[.3,.5],'spark','turn','Küçük zikzaklarla taşların arasında ilerler.'),
];

export const speciesById = new Map(speciesRegistry.map((item) => [item.id, item]));
export const speciesForBiome = (biomeId: BiomeId) => speciesRegistry.filter((item) => item.biomeId === biomeId);
