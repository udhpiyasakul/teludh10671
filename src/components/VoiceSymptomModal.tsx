import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Phone, 
  Building2, 
  MapPin, 
  Layers, 
  Check, 
  Copy, 
  PhoneCall, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  HelpCircle, 
  Search, 
  ArrowRight,
  RotateCcw,
  Stethoscope,
  ChevronRight,
  Info,
  Delete
} from 'lucide-react';
import { UDHPhoneRecord } from '../types';
import { BUILDING_COLORS } from '../data/constants';
import { getCallablePhoneHref, getDialTooltip } from '../utils/phoneUtils';
import { 
  triageSymptomQuery, 
  POPULAR_SYMPTOM_PRESETS, 
  TriageResult 
} from '../services/symptomTriageService';

interface VoiceSymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: UDHPhoneRecord[];
  onCopyPhone: (phone: string, unit: string) => void;
  copiedPhone: string | null;
  onApplySearchToMainTable?: (query: string) => void;
}

export const VoiceSymptomModal: React.FC<VoiceSymptomModalProps> = ({
  isOpen,
  onClose,
  records,
  onCopyPhone,
  copiedPhone,
  onApplySearchToMainTable
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'dialpad'>('voice');
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  
  // Dialpad state
  const [dialedDigits, setDialedDigits] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'th-TH';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setTranscript(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('เบราว์เซอร์ยังไม่ได้รับอนุญาตให้ใช้ไมโครโฟน กรุณากดอนุญาตหรือพิมพ์ข้อความแทน');
        } else if (event.error === 'no-speech') {
          // No speech detected, quietly stop
        } else {
          setSpeechError(`เกิดข้อผิดพลาดในการรับเสียง (${event.error}) สามารถพิมพ์อาการลงในช่องค้นหาได้`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Error setting up speech recognition:', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  // Update triage results when transcript changes
  useEffect(() => {
    if (transcript.trim()) {
      const result = triageSymptomQuery(transcript, records);
      setTriageResult(result);
    } else {
      setTriageResult(null);
    }
  }, [transcript, records]);

  // Handle Voice Toggle
  const toggleListening = () => {
    if (!speechSupported) {
      setSpeechError('อุปกรณ์นี้ไม่รองรับการรู้จำเสียงพูดผ่านเบราว์เซอร์ กรุณาพิมพ์ข้อความแทน');
      inputRef.current?.focus();
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.warn('Start recognition error:', e);
        try {
          recognitionRef.current?.abort();
          setTimeout(() => recognitionRef.current?.start(), 150);
        } catch (err) {
          setSpeechError('ไม่สามารถเริ่มระบบเสียงได้ กรุณาลองใหม่อีกครั้งหรือพิมพ์ข้อความ');
        }
      }
    }
  };

  // Preset symptom click
  const handleSelectPreset = (text: string) => {
    setTranscript(text);
  };

  // Dialpad handlers
  const handleDigitClick = (digit: string) => {
    if (dialedDigits.length < 10) {
      setDialedDigits(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setDialedDigits(prev => prev.slice(0, -1));
  };

  const handleClearDialpad = () => {
    setDialedDigits('');
  };

  const matchedDialRecords = dialedDigits.trim() 
    ? records.filter(r => r.phone.replace(/[^0-9]/g, '').includes(dialedDigits.replace(/[^0-9]/g, '')) || r.unit.toLowerCase().includes(dialedDigits.toLowerCase()))
    : [];

  const handleApplyToMainTable = (textToApply: string) => {
    if (onApplySearchToMainTable) {
      onApplySearchToMainTable(textToApply);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden border border-slate-200 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header with Dual Tabs */}
        <div className="bg-gradient-to-r from-teal-900 via-cyan-900 to-teal-950 text-white">
          <div className="px-5 py-3.5 flex items-center justify-between border-b border-teal-800/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight">ระบบค้นด้วยเสียง & แนะนำห้องตรวจตามอาการ</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/30 text-teal-200 border border-teal-400/40">
                    Smart Voice OPD
                  </span>
                </div>
                <p className="text-[11px] text-teal-200/90 mt-0.5">
                  พูดบอกอาการ หรือหน่วยงาน เพื่อให้ระบบหาห้องตรวจ อาคาร ชั้น และเบอร์โทรศัพท์ที่ถูกต้อง
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-800/80 cursor-pointer transition-colors"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 pt-2 flex items-center gap-2 bg-teal-950/40">
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl border-t border-x transition-all cursor-pointer ${
                activeTab === 'voice'
                  ? 'bg-white text-teal-950 border-teal-200 shadow-xs'
                  : 'bg-transparent text-teal-200/80 border-transparent hover:text-white hover:bg-teal-800/40'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-teal-600" />
              <span>ค้นด้วยเสียง & แนะนำห้องตรวจ</span>
            </button>

            <button
              onClick={() => setActiveTab('dialpad')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl border-t border-x transition-all cursor-pointer ${
                activeTab === 'dialpad'
                  ? 'bg-white text-teal-950 border-teal-200 shadow-xs'
                  : 'bg-transparent text-teal-200/80 border-transparent hover:text-white hover:bg-teal-800/40'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>ค้นตามเบอร์ 4 หลัก (Dialpad)</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
          {activeTab === 'voice' ? (
            <div className="p-4 sm:p-5 space-y-4">

              {/* Voice Interaction Card */}
              <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-teal-100/50 to-transparent rounded-bl-full pointer-events-none" />

                {/* Big Mic Button & State */}
                <div className="flex flex-col items-center justify-center text-center py-2">
                  <div className="relative mb-3">
                    {isListening && (
                      <>
                        <span className="absolute -inset-3 rounded-full bg-rose-400/30 animate-ping opacity-75" />
                        <span className="absolute -inset-1.5 rounded-full bg-rose-500/20 animate-pulse" />
                      </>
                    )}
                    <button
                      onClick={toggleListening}
                      id="btn-voice-toggle"
                      className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer ${
                        isListening
                          ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-200'
                          : 'bg-gradient-to-tr from-teal-700 to-cyan-600 hover:from-teal-600 hover:to-cyan-500 text-white shadow-teal-700/25 ring-4 ring-teal-100'
                      }`}
                      title={isListening ? 'กดเพื่อหยุดฟังเสียง' : 'กดเพื่อเริ่มพูดบอกอาการหรือชื่อห้องตรวจ'}
                    >
                      {isListening ? (
                        <MicOff className="w-7 h-7 animate-bounce" />
                      ) : (
                        <Mic className="w-7 h-7" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      {isListening ? (
                        <span className="text-rose-600 flex items-center justify-center gap-1.5 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-rose-600" />
                          กำลังฟังเสียงพูดของคุณ... กรุณาบอกอาการ เช่น &ldquo;ปวดฟัน&rdquo; หรือ &ldquo;เด็กมีไข้&rdquo;
                        </span>
                      ) : transcript ? (
                        'กดที่ไมโครโฟนเพื่อพูดใหม่อีกครั้ง หรือพิมพ์แก้ไขข้อความด้านล่าง'
                      ) : (
                        'กดปุ่มไมโครโฟน แล้วพูดบอกอาการเบื้องต้น หรือชื่อห้องที่ต้องการ'
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      ระบบจะแปลงเสียงพูดภาษาไทยเป็นข้อความ และค้นหาห้องตรวจพร้อมเบอร์โทรให้อัตโนมัติ
                    </p>
                  </div>

                  {speechError && (
                    <div className="mt-3 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5 text-left max-w-md">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{speechError}</span>
                    </div>
                  )}
                </div>

                {/* Voice / Text Input Box */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      id="input-voice-transcript"
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="อาการหรือข้อความที่ได้ยิน (หรือพิมพ์อาการ เช่น แน่นหน้าอก, ขาหัก, ผื่นคัน)..."
                      className="w-full pl-10 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all"
                    />
                    {transcript && (
                      <button
                        onClick={() => {
                          setTranscript('');
                          setTriageResult(null);
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
                        title="ล้างข้อความ"
                      >
                        ล้าง
                      </button>
                    )}
                  </div>
                </div>

                {/* Popular Symptom Chips */}
                <div className="mt-3 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                    <span>หรือเลือกตัวอย่างอาการยอดนิยม:</span>
                    <span className="text-[10px] text-teal-700">คลิกเพื่อดูห้องตรวจทันที</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {POPULAR_SYMPTOM_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => handleSelectPreset(preset.text)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          transcript === preset.text
                            ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                            : 'bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 border-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Triage Recommendation Result */}
              {triageResult && triageResult.query ? (
                <div className="space-y-3 animate-in fade-in duration-200">
                  
                  {/* Urgent / Emergency Alert Banner if applicable */}
                  {triageResult.isEmergencyAlert && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-900">
                      <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0 mt-0.5">
                        <ShieldAlert className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="font-bold text-rose-800 text-sm flex items-center gap-2">
                          <span>แจ้งเตือน: อาการฉุกเฉินวิกฤต (Emergency Triage)</span>
                        </div>
                        <p className="mt-1 text-rose-700 leading-relaxed">
                          หากมีอาการหมดสติ หายใจไม่ออก แขนขาอ่อนแรงฉับพลัน หรืออุบัติเหตุรุนแรง กรุณาติดต่อสายด่วนกู้ชีพ 1669 หรือตรงไปที่ห้องฉุกเฉิน (ER) ทันที
                        </p>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <a
                            href="tel:1669"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>โทร 1669 ทันที</span>
                          </a>
                          <a
                            href="tel:042215100"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>เบอร์หลัก รพ. 042-215100</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Primary Diagnosis & Room Recommendation Card */}
                  {triageResult.primaryMatch && (
                    <div className="bg-white rounded-2xl border border-teal-200 shadow-sm overflow-hidden">
                      <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-teal-600 text-white">
                            <Stethoscope className="w-4 h-4" />
                          </span>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                              ห้องตรวจและแผนกที่แนะนำ
                            </span>
                            <h4 className="text-sm font-extrabold text-teal-950">
                              {triageResult.primaryMatch.departmentName}
                            </h4>
                          </div>
                        </div>

                        {/* Urgency Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          triageResult.urgency === 'emergency'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : triageResult.urgency === 'urgent'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {triageResult.primaryMatch.urgencyLabel}
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        
                        {/* Location Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {triageResult.primaryMatch.preferredBuilding && (
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                              <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
                              <span className="text-slate-600">อาคาร:</span>
                              <span className="font-semibold text-slate-900 truncate">
                                {triageResult.primaryMatch.preferredBuilding}
                              </span>
                            </div>
                          )}
                          {triageResult.primaryMatch.preferredFloor && (
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                              <Layers className="w-4 h-4 text-teal-700 shrink-0" />
                              <span className="text-slate-600">ชั้น:</span>
                              <span className="font-semibold text-slate-900">
                                {triageResult.primaryMatch.preferredFloor}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Medical Preparation & Patient Guidance */}
                        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            <span className="font-bold text-amber-950">คำแนะนำเบื้องต้น: </span>
                            {triageResult.advice}
                          </div>
                        </div>

                        {/* Search in main table quick button */}
                        {onApplySearchToMainTable && (
                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => handleApplyToMainTable(triageResult.primaryMatch?.departmentName || transcript)}
                              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 hover:underline cursor-pointer"
                            >
                              <span>กรองดูห้องตรวจนี้ในตารางหน้าหลัก</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* Matched Real Phone Records from UDH */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        <span>หมายเลขโทรศัพท์ห้องตรวจและหน่วยงานที่เกี่ยวข้อง ({triageResult.matchedRecords.length} รายการ)</span>
                      </span>
                    </div>

                    {triageResult.matchedRecords.length > 0 ? (
                      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                        {triageResult.matchedRecords.map((item) => {
                          const isCopied = copiedPhone === item.phone;
                          const buildingStyle = BUILDING_COLORS[item.building] || {
                            badge: 'bg-slate-100 text-slate-800'
                          };

                          return (
                            <div
                              key={item.id}
                              className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-teal-300 transition-all"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                  {item.unit}
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{item.building}</span>
                                  <span className="text-slate-300">•</span>
                                  <span>{item.floor}</span>
                                </div>
                                {item.note && (
                                  <div className="text-[10px] text-amber-700 font-medium mt-0.5 truncate">
                                    หมายเหตุ: {item.note}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="font-mono text-sm font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                  {item.phone}
                                </span>
                                
                                <button
                                  onClick={() => onCopyPhone(item.phone, item.unit)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    isCopied 
                                      ? 'bg-emerald-500 text-white border-emerald-500' 
                                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                                  }`}
                                  title="คัดลอกหมายเลข"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>

                                <a
                                  href={getCallablePhoneHref(item.phone)}
                                  className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                                  title={getDialTooltip(item.phone, item.unit)}
                                >
                                  <PhoneCall className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                        ไม่พบหมายเลขที่ตรงกับคำค้นหาโดยตรง แนะนำติดต่อโอเปอเรเตอร์ 042-215100 ต่อ 0
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* Empty state hint */
                <div className="text-center py-8 px-4 bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                    <Mic className="w-6 h-6" />
                  </div>
                  <h5 className="font-semibold text-slate-700 text-xs sm:text-sm">
                    เริ่มต้นด้วยการกดปุ่มไมโครโฟน แล้วพูดบอกอาการ
                  </h5>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    เช่น &ldquo;ปวดท้องรุนแรง&rdquo;, &ldquo;ตาแดงมองไม่ชัด&rdquo;, &ldquo;กระดูกหัก&rdquo;, หรือ &ldquo;ทำบัตรใหม่&rdquo; ระบบจะช่วยแนะนำห้องตรวจและเบอร์โทรที่ถูกต้อง
                  </p>
                </div>
              )}

            </div>
          ) : (
            /* Dialpad Tab (Retaining full original numeric reverse lookup) */
            <div className="flex flex-col flex-1">
              
              {/* Dialed Display */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex-1 text-center">
                  <div className="text-xs text-slate-400 font-medium mb-1">พิมพ์หรือกดหมายเลขโทรศัพท์ 4 หลัก</div>
                  <input
                    type="text"
                    autoFocus
                    value={dialedDigits}
                    onChange={(e) => setDialedDigits(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    placeholder="กดตัวเลข เช่น 3124..."
                    className="w-full text-center font-mono text-3xl font-extrabold text-teal-900 tracking-widest bg-transparent focus:outline-none placeholder:text-slate-300 placeholder:text-xl placeholder:font-normal"
                  />
                </div>
                {dialedDigits && (
                  <button
                    onClick={handleBackspace}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer shrink-0"
                    title="ลบตัวเลข"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Keypad Grid */}
              <div className="p-4 grid grid-cols-3 gap-2 bg-slate-50 border-b border-slate-200">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => {
                  if (btn === 'C') {
                    return (
                      <button
                        key={btn}
                        onClick={handleClearDialpad}
                        className="py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition-all cursor-pointer"
                      >
                        ล้าง (C)
                      </button>
                    );
                  }
                  if (btn === '⌫') {
                    return (
                      <button
                        key={btn}
                        onClick={handleBackspace}
                        className="py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition-all flex items-center justify-center cursor-pointer"
                      >
                        <Delete className="w-4 h-4" />
                      </button>
                    );
                  }
                  return (
                    <button
                      key={btn}
                      onClick={() => handleDigitClick(btn)}
                      className="py-2.5 rounded-xl bg-white hover:bg-teal-50 hover:border-teal-300 active:scale-95 border border-slate-200 text-slate-800 font-mono font-bold text-lg shadow-2xs transition-all cursor-pointer"
                    >
                      {btn}
                    </button>
                  );
                })}
              </div>

              {/* Dialpad Shortcuts */}
              <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-[11px] font-semibold text-slate-500">ทางลัด:</span>
                <button
                  onClick={() => setDialedDigits('042215100')}
                  className="px-2 py-0.5 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-mono text-[11px] cursor-pointer"
                >
                  042-215100
                </button>
                <button
                  onClick={() => setDialedDigits('042245555')}
                  className="px-2 py-0.5 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-mono text-[11px] cursor-pointer"
                >
                  042-245555
                </button>
                <button
                  onClick={() => setDialedDigits('0')}
                  className="px-2 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-mono text-[11px] cursor-pointer"
                >
                  Operator (0)
                </button>
                <button
                  onClick={() => setDialedDigits('1000')}
                  className="px-2 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-mono text-[11px] cursor-pointer"
                >
                  1000
                </button>
                <button
                  onClick={() => setDialedDigits('3124')}
                  className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-mono text-[11px] cursor-pointer"
                >
                  1669 / 3124
                </button>
              </div>

              {/* Matched Dial Results List */}
              <div className="p-4 flex-1 overflow-y-auto space-y-2 bg-slate-50">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>ผลการค้นหา {dialedDigits ? `(${matchedDialRecords.length} รายการ)` : ''}</span>
                  {dialedDigits && (
                    <span className="text-teal-700 font-medium">มีเลข &ldquo;{dialedDigits}&rdquo;</span>
                  )}
                </div>

                {dialedDigits ? (
                  matchedDialRecords.length > 0 ? (
                    matchedDialRecords.map(item => {
                      const isCopied = copiedPhone === item.phone;
                      return (
                        <div
                          key={item.id}
                          className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 text-xs truncate">
                              {item.unit}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{item.building}</span>
                              <span className="text-slate-300">•</span>
                              <span>{item.floor}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-mono text-sm font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              {item.phone}
                            </span>
                            <button
                              onClick={() => onCopyPhone(item.phone, item.unit)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isCopied ? 'bg-emerald-500 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                              }`}
                              title="คัดลอก"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <a
                              href={getCallablePhoneHref(item.phone)}
                              className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white"
                              title={getDialTooltip(item.phone, item.unit)}
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      ไม่พบหน่วยงานที่ตรงกับหมายเลขนี้
                    </div>
                  )
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    กรุณากดหมายเลข 4 หลักเพื่อค้นหาห้องและหน่วยงาน
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>ฉุกเฉินวิกฤตตลอด 24 ชั่วโมง ติดต่อห้องฉุกเฉินหรือ 1669</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
