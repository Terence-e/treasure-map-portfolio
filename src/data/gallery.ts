/**
 * Project imagery, extracted from the 21-page Project Portfolio PDF and
 * re-encoded to WebP at 1100px. Keyed by project id; the captions are
 * the portfolio's own.
 */
export type Shot = { src: string; caption: string }

const BASE = import.meta.env.BASE_URL

export const gallery: Record<string, Shot[]> = {
  'kampus': [
    { src: BASE + 'img/kampus--login.webp', caption: `The login flow on the IPF tenant — the school’s own logo and green charte come from per-institution config, and the field asks for an ID étudiant ou personnel, never an e-mail address` },
    { src: BASE + 'img/kampus--admin.webp', caption: `Behind the login: the super-admin view for Institut Privé Fang de Messamena — fees collected, arrears, enrolment and attendance, in French and in FCFA (figures blurred)` },
    { src: BASE + 'img/kampus--access.webp', caption: `Accès et capacités: granting and revoking what each administrator may do, with join-request approval and role-scoped access codes carrying an expiry and a usage cap` },
  ],
  'uniform': [
    { src: BASE + 'img/uniform--dashboard.webp', caption: `Dashboard: month-to-date sales and revenue in FCFA, low-stock alerts, and the module map — items marked Planned are scoped but deliberately not shipped` },
    { src: BASE + 'img/uniform--till.webp', caption: `The till: a sale is recorded against student and class, with payment method and the person who took the money both captured` },
    { src: BASE + 'img/uniform--orders.webp', caption: `Orders: a garment paid for now and collected later, with measurements, an expected ready date and a status the shop can follow` },
    { src: BASE + 'img/uniform--accounts.webp', caption: `Accounts are created by an administrator with a generated temporary password — there is no public sign-up. Names, e-mails and the live password are blurred` },
  ],
  'frst-timetable': [
    { src: BASE + 'img/frst-timetable--paper-1.webp', caption: `What it replaces: the hand-ruled timetable for 3ⁿ Allemand, signed off in pen` },
    { src: BASE + 'img/frst-timetable--paper-2.webp', caption: `One class per sheet, rewritten by hand every time anything moved` },
  ],
  'school-it': [
    { src: BASE + 'img/school-it--school.webp', caption: `Fondation Révélation Sainte Thérèse, Yaoundé — the school this work was built for` },
  ],
  'truth-machine': [
    { src: BASE + 'img/truth-machine--costs.webp', caption: `The cost lesson: the identical model on EUR/USD 2009, +44% before costs and −91% after. Accuracy is not profit` },
    { src: BASE + 'img/truth-machine--overfit.webp', caption: `The overfitting trap: total P&L zig-zagging across hold length. Incoherent means noise, not edge — the biggest green bar looked like a discovery` },
    { src: BASE + 'img/truth-machine--gate.webp', caption: `The gate refusing a fake: this strategy (green) must beat the expected best-by-luck line (red) to count. Deflated Sharpe 0.029 → FAIL` },
    { src: BASE + 'img/truth-machine--fib.webp', caption: `Disproving Fibonacci with data: reversals land everywhere, and the classic levels fall on ordinary heights` },
  ],
  'knightmare': [
    { src: BASE + 'img/knightmare--site.webp', caption: `Area 01 of the live site, rendered from the production build` },
  ],
  'sentinel': [
    { src: BASE + 'img/sentinel--gui.webp', caption: `The scanner’s own interface: one tab per check module, per-module scan status, live risk summary and AI commentary` },
    { src: BASE + 'img/sentinel--dashboard.webp', caption: `The generated HTML dashboard: findings per category around the target, with the overall verdict and totals along the bottom` },
  ],
  'chess': [
    { src: BASE + 'img/chess--rxc3.webp', caption: `Rxc3!! — the rook steps onto a defended square; evaluation swings to −6.83, Black winning` },
    { src: BASE + 'img/chess--rxh6.webp', caption: `Rxh6!! — the same idea against a castled king, worth −4.51 after the piece comes off` },
  ],
  'traffic-sign': [
    { src: BASE + 'img/traffic-sign--inference.webp', caption: `Live inference: a hand-drawn right-turn sign classified in real time` },
    { src: BASE + 'img/traffic-sign--cnn.webp', caption: `The CNN: two convolutional blocks into two dense layers, six output classes` },
  ],
  'smart-bicycle': [
    { src: BASE + 'img/smart-bicycle--unit.webp', caption: `The finished unit running: Speed:0.0km/h on the 16×2 LCD, keypad below, PIC16F18877 on stripboard` },
    { src: BASE + 'img/smart-bicycle--testing.webp', caption: `Full-system testing: soldered board and continuity verification on the bench` },
  ],
  'bicycle-sim': [
    { src: BASE + 'img/bicycle-sim--menu.webp', caption: `Simulated front panel: the measurement menu on the 16×2 LCD` },
    { src: BASE + 'img/bicycle-sim--speed.webp', caption: `Speed reported back over a 10-second sampling window` },
  ],
  'tracked-robot': [
    { src: BASE + 'img/tracked-robot--assembly.webp', caption: `Shaded assembly views of the tracked chassis, arm and claw` },
    { src: BASE + 'img/tracked-robot--drawing.webp', caption: `Final group drawing — mechanical claw and arm gearing detailed to BS8888` },
  ],
  'pid-mycobot': [
    { src: BASE + 'img/pid-mycobot--step.webp', caption: `Existing versus revised closed-loop step response — peak and settling points marked` },
    { src: BASE + 'img/pid-mycobot--dh.webp', caption: `Modified D–H frame assignment for the six joints of the myCobot 280 Pi` },
  ],
  'chebyshev': [
    { src: BASE + 'img/chebyshev--orcad.webp', caption: `Denormalised band-pass network as built in OrCAD` },
    { src: BASE + 'img/chebyshev--pspice.webp', caption: `Simulated response with cursors on the band edges` },
  ],
  'verilog': [
    { src: BASE + 'img/verilog--waveform.webp', caption: `ModelSim waveform: clock, select, enable, reset and the parity/BCD outputs` },
  ],
  'sequential-logic': [
    { src: BASE + 'img/sequential-logic--schematic.webp', caption: `Flip-flop schematic for the 4-bit sequential counter` },
    { src: BASE + 'img/sequential-logic--bench.webp', caption: `The same design wired up and running on the bench` },
  ],
  'pic-labs': [
    { src: BASE + 'img/pic-labs--board.webp', caption: `The Matrix Multimedia E-blocks2 PIC development board used for all eight laboratories` },
    { src: BASE + 'img/pic-labs--multiplex.webp', caption: `Display multiplex scan: the loop that makes four digits look simultaneous` },
  ],
  'oop-java': [
    { src: BASE + 'img/oop-java--uml.webp', caption: `Supermarket class diagram — the model the implementation was held to` },
  ],
  'cad-bench': [
    { src: BASE + 'img/cad-bench--subject.webp', caption: `The subject, measured on site` },
    { src: BASE + 'img/cad-bench--render.webp', caption: `The finished Fusion 360 model, rendered` },
  ],
}

/** The single image that represents a project in previews and on billboards. */
export function heroShot(id: string): Shot | undefined {
  return gallery[id]?.[0]
}
