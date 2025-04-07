import { Injectable } from '@angular/core';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faAngleUp,
  faArrowDownWideShort,
  faArrowRightArrowLeft,
  faArrowsRotate,
  faArrowUpRightFromSquare,
  faArrowUpWideShort,
  faCakeCandles,
  faCalendar,
  faCalendarDays,
  faCancel,
  faCaretDown,
  faGear,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCircle,
  faCircleInfo,
  faClock,
  faClockRotateLeft,
  faCog,
  faCogs,
  faCow,
  faDna,
  faEarthAmericas,
  faEllipsisH,
  faEllipsisVertical,
  faExclamationCircle,
  faFileContract,
  faFileExport,
  faFileImport,
  faFileSignature,
  faFilter,
  faFilterCircleDollar,
  faFilterCircleXmark,
  faGripVertical,
  faHandHoldingHeart,
  faHandsHoldingChild,
  faHashtag,
  faHome,
  faHorseHead,
  faHospital,
  faInfoCircle,
  faKitMedical,
  faLink,
  faList,
  faLocationDot,
  faMars,
  faMinus,
  faMoneyBill1Wave,
  faMoneyBills,
  faNotesMedical,
  faPencil,
  faPenToSquare,
  faPersonBreastfeeding,
  faPersonCane,
  faPhone,
  faPlus,
  faRotateRight,
  faSave,
  faSearch,
  faSignInAlt,
  faSignOut,
  faSliders,
  faSort,
  faSortDown,
  faSortUp,
  faSquareEnvelope,
  faSquarePhone,
  faTableCellsLarge,
  faTableList,
  faTimes,
  faTrademark,
  faTrashCan,
  faTriangleExclamation,
  faUser,
  faUserAlt,
  faUsers,
  faVectorSquare,
  faVenus,
  faWeightHanging,
  faWeightScale,
  faWheatAwn,
  faXmark,
  faBan,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCalendar as faRegCalendar,
  faCheckCircle,
  faCircleQuestion as faRegCircleQuestion,
  faCircleUser,
  faClipboard,
  faCreditCard,
  faEdit,
  faEnvelope,
  faEye,
  faFileLines,
  faFileZipper as farFileZipper,
  faIdCard as faRegIdCard,
  faImage as farImage,
  faNoteSticky,
  faPaperPlane,
  faTrashCan as faRegTrashCan,
  faUser as farUser,
  faWindowRestore,
} from '@fortawesome/free-regular-svg-icons';
import {
  FaIconLibrary,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  constructor(private library: FaIconLibrary) {
    this.loadIcons();
  }

  loadIcons(): void {
    this.library.addIcons(
      faSort,
      faEllipsisH,
      faPlus,
      faFileExport,
      faArrowsRotate,
      faTimes,
      faArrowsRotate,
      faMinus,
      faPenToSquare,
      faTrashCan,
      faCheck,
      faChevronRight,
      faChevronLeft,
      faCalendar,
      faRegCalendar,
      faSearch,
      faCancel,
      faAngleLeft,
      faAngleRight,
      faClock,
      faWeightScale,
      faWeightHanging,
      faCalendarDays,
      faLocationDot,
      faSortUp,
      faSortDown,
      faArrowDownWideShort,
      faArrowUpWideShort,
      faAngleDown,
      faAngleUp,
      faSliders,
      faAngleDoubleLeft,
      faAngleDoubleRight,
      faPersonBreastfeeding,
      faNotesMedical,
      faWheatAwn,
      faHandHoldingHeart,
      faHospital,
      faClipboard,
      faTriangleExclamation,
      faMoneyBills,
      faDna,
      faNoteSticky,
      faEarthAmericas,
      faPencil,
      faChevronDown,
      faHandsHoldingChild,
      faPersonCane,
      faEye,
      faEdit,
      faUser,
      faUserAlt,
      farUser,
      faHome,
      faCow,
      faHorseHead,
      faUsers,
      faCogs,
      faSave,
      faCircleInfo,
      faArrowUpRightFromSquare,
      faSignOut,
      faSignInAlt,
      faCog,
      faVenus,
      faMars,
      faList,
      faTableCellsLarge,
      faMoneyBill1Wave,
      faTrademark,
      faVectorSquare,
      faClockRotateLeft,
      faLink,
      farFileZipper,
      farImage,
      faCaretRight,
      faCircle,
      faCaretUp,
      faCaretLeft,
      faCaretDown,
      faFilter,
      faFilterCircleDollar,
      faFilterCircleXmark,
      faFileContract,
      faFileSignature,
      faWindowRestore,
      faRegCircleQuestion,
      faTableList,
      faRegIdCard,
      faInfoCircle,
      faRegTrashCan,
      faFileImport,
      faXmark,
      faPhone,
      faSquarePhone,
      faSquareEnvelope,
      faCircleUser,
      faCakeCandles,
      faKitMedical,
      faCreditCard,
      faArrowRightArrowLeft,
      faCheckCircle,
      faPaperPlane,
      faRegCircleQuestion,
      faEllipsisVertical,
      faBan,
      faCircleXmark
    );
  }

  faSort: IconDefinition = faSort;
  faEllipsisH: IconDefinition = faEllipsisH;
  faPlus: IconDefinition = faPlus;
  faFileExport: IconDefinition = faFileExport;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faTimes: IconDefinition = faTimes;
  faArrowsRoate: IconDefinition = faArrowsRotate;
  faMinus: IconDefinition = faMinus;
  faPenToSquare: IconDefinition = faPenToSquare;
  faTrashCan: IconDefinition = faTrashCan;
  faCheck: IconDefinition = faCheck;
  faChevronRight: IconDefinition = faChevronRight;
  faChevronLeft: IconDefinition = faChevronLeft;
  faCalendar: IconDefinition = faCalendar;
  faRegCalendar: IconDefinition = faRegCalendar;
  faSearch: IconDefinition = faSearch;
  faCancel: IconDefinition = faCancel;
  faAngleLeft: IconDefinition = faAngleLeft;
  faAngleRight: IconDefinition = faAngleRight;
  faClock: IconDefinition = faClock;
  faWeightScale: IconDefinition = faWeightScale;
  faWeightHanging: IconDefinition = faWeightHanging;
  faCalendarDays: IconDefinition = faCalendarDays;
  faLocationDot: IconDefinition = faLocationDot;
  faSortUp: IconDefinition = faSortUp;
  faSortDown: IconDefinition = faSortDown;
  faArrowDownWideShort: IconDefinition = faArrowDownWideShort;
  faArrowUpWideShort: IconDefinition = faArrowUpWideShort;
  faAngleDown: IconDefinition = faAngleDown;
  faAngleUp: IconDefinition = faAngleUp;
  faSliders: IconDefinition = faSliders;
  faAngleDoubleLeft: IconDefinition = faAngleDoubleLeft;
  faAngleDoubleRight: IconDefinition = faAngleDoubleRight;
  faPersonBreastfeeding: IconDefinition = faPersonBreastfeeding;
  faNotesMedical: IconDefinition = faNotesMedical;
  faWheatAwn: IconDefinition = faWheatAwn;
  faHandHoldingHeart: IconDefinition = faHandHoldingHeart;
  faHospital: IconDefinition = faHospital;
  faClipboard: IconDefinition = faClipboard;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  faMoneyBills: IconDefinition = faMoneyBills;
  faDna: IconDefinition = faDna;
  faNoteSticky: IconDefinition = faNoteSticky;
  faEarthAmericas: IconDefinition = faEarthAmericas;
  faPencil: IconDefinition = faPencil;
  faChevronDown: IconDefinition = faChevronDown;
  faHandsHoldingChild: IconDefinition = faHandsHoldingChild;
  faPersonCane: IconDefinition = faPersonCane;
  faEye: IconDefinition = faEye;
  faEdit: IconDefinition = faEdit;
  faUser: IconDefinition = faUser;
  faUserAlt: IconDefinition = faUserAlt;
  farUser: IconDefinition = farUser;
  faHome: IconDefinition = faHome;
  faCow: IconDefinition = faCow;
  faHorseHead: IconDefinition = faHorseHead;
  faUsers: IconDefinition = faUsers;
  faCogs: IconDefinition = faCogs;
  faSave: IconDefinition = faSave;
  faCircleInfo: IconDefinition = faCircleInfo;
  faArrowUpRightFromSquare: IconDefinition = faArrowUpRightFromSquare;
  faSignOut: IconDefinition = faSignOut;
  faSignInAlt: IconDefinition = faSignInAlt;
  faCog: IconDefinition = faCog;
  faVenus: IconDefinition = faVenus;
  faMars: IconDefinition = faMars;
  faList: IconDefinition = faList;
  faTableCellsLarge: IconDefinition = faTableCellsLarge;
  faMoneyBill1Wave: IconDefinition = faMoneyBill1Wave;
  faTrademark: IconDefinition = faTrademark;
  faVectorSquare: IconDefinition = faVectorSquare;
  faClockRotateLeft: IconDefinition = faClockRotateLeft;
  faLink: IconDefinition = faLink;
  farFileZipper: IconDefinition = farFileZipper;
  farImage: IconDefinition = farImage;
  faCaretRight: IconDefinition = faCaretRight;
  faCircle: IconDefinition = faCircle;
  faCaretUp: IconDefinition = faCaretUp;
  faCaretLeft: IconDefinition = faCaretLeft;
  faCaretDown: IconDefinition = faCaretDown;
  faFilter: IconDefinition = faFilter;
  faFilterCircleDollar: IconDefinition = faFilterCircleDollar;
  faFilterCircleXmark: IconDefinition = faFilterCircleXmark;
  faFileContract: IconDefinition = faFileContract;
  faFileSignature: IconDefinition = faFileSignature;
  faWindowRestore: IconDefinition = faWindowRestore;
  faRegCircleQuestion: IconDefinition = faRegCircleQuestion;
  faTableList: IconDefinition = faTableList;
  faRegIdCard: IconDefinition = faRegIdCard;
  faInfoCircle: IconDefinition = faInfoCircle;
  faRegTrashCan: IconDefinition = faRegTrashCan;
  faFileImport: IconDefinition = faFileImport;
  faXmark: IconDefinition = faXmark;
  faPhone: IconDefinition = faPhone;
  faSquarePhone: IconDefinition = faSquarePhone;
  faSquareEnvelope: IconDefinition = faSquareEnvelope;
  faCircleUser: IconDefinition = faCircleUser;
  faCakeCandles: IconDefinition = faCakeCandles;
  faKitMedical: IconDefinition = faKitMedical;
  faCreditCard: IconDefinition = faCreditCard;
  faArrowRightArrowLeft: IconDefinition = faArrowRightArrowLeft;
  faCheckCircle: IconDefinition = faCheckCircle;
  faPaperPlane: IconDefinition = faPaperPlane;
  faQuestionCircle: IconDefinition = faRegCircleQuestion;
  faFileLines: IconDefinition = faFileLines;
  faHashtag: IconDefinition = faHashtag;
  faEnvelope: IconDefinition = faEnvelope;
  faRotateRight: IconDefinition = faRotateRight;
  faExclamationCircle: IconDefinition = faExclamationCircle;
  faGripVertical: IconDefinition = faGripVertical;
  faGear: IconDefinition = faGear;
  faEllipsisVertical: IconDefinition = faEllipsisVertical;
  faBan: IconDefinition = faBan;
  faCircleXmark: IconDefinition = faCircleXmark;
}
