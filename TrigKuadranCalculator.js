'use client';

import React, { useState } from 'react';
import { Calculator, Circle, Info } from 'lucide-react';

export default function TrigKuadranCalculator() {
  const [sudut, setSudut] = useState('');
  const [hasil, setHasil] = useState(null);

  const getNilaiEksak = (angle) => {
    const nilaiSpesial = {
      0: { sin: '0', cos: '1', tan: '0' },
      30: { sin: '1/2', cos: '(1/2)√3', tan: '(1/3)√3' },
      45: { sin: '(1/2)√2', cos: '(1/2)√2', tan: '1' },
      60: { sin: '(1/2)√3', cos: '1/2', tan: '√3' },
      90: { sin: '1', cos: '0', tan: '∞' }
    };
    
    return nilaiSpesial[angle] || null;
  };

  const getKuadran = (angle) => {
    let normalized = angle % 360;
    if (normalized < 0) normalized += 360;
    
    if (normalized > 0 && normalized <= 90) return 1;
    if (normalized > 90 && normalized <= 180) return 2;
    if (normalized > 180 && normalized <= 270) return 3;
    if (normalized > 270 && normalized < 360) return 4;
    return 1;
  };

  const getTandaKuadran = (kuadran, fungsi) => {
    const tanda = {
      1: { sin: '+', cos: '+', tan: '+' },
      2: { sin: '+', cos: '-', tan: '-' },
      3: { sin: '-', cos: '-', tan: '+' },
      4: { sin: '-', cos: '+', tan: '-' }
    };
    return tanda[kuadran][fungsi];
  };

  const hitungNilaiTrigonometri = () => {
    if (!sudut) {
      alert('Masukkan sudut terlebih dahulu!');
      return;
    }

    const angle = parseFloat(sudut);
    let normalized = angle % 360;
    if (normalized < 0) normalized += 360;
    
    const kuadran = getKuadran(normalized);
    
    const referensiPoints = [0, 90, 180, 270, 360];
    
    let minDistance = Infinity;
    let closestPoint = 0;
    
    referensiPoints.forEach(point => {
      const distance = Math.abs(normalized - point);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });
    
    let k = 0;
    if (closestPoint === 0 || closestPoint === 360) k = 0;
    else if (closestPoint === 90) k = 1;
    else if (closestPoint === 180) k = 2;
    else if (closestPoint === 270) k = 3;
    
    let sudutRef = Math.abs(normalized - closestPoint);
    
    let rumusSudut = '';
    let operasi = '';
    
    if (closestPoint === 0) {
      rumusSudut = `${sudutRef}°`;
      operasi = 'sama dengan';
    } else if (normalized < closestPoint) {
      rumusSudut = `(${closestPoint}° - ${sudutRef}°)`;
      operasi = '-';
    } else {
      rumusSudut = `(${closestPoint}° + ${sudutRef}°)`;
      operasi = '+';
    }

    const radian = normalized * (Math.PI / 180);
    
    const sinVal = Math.sin(radian);
    const cosVal = Math.cos(radian);
    const tanVal = Math.tan(radian);

    const nilaiEksak = getNilaiEksak(sudutRef);

    const tandaSin = getTandaKuadran(kuadran, 'sin');
    const tandaCos = getTandaKuadran(kuadran, 'cos');
    const tandaTan = getTandaKuadran(kuadran, 'tan');

    setHasil({
      sudutAsli: angle,
      sudutNormalized: normalized,
      sudutReferensi: sudutRef,
      closestPoint: closestPoint,
      rumusSudut: rumusSudut,
      operasi: operasi,
      kuadran: kuadran,
      kValue: k,
      sin: {
        desimal: sinVal.toFixed(4),
        eksak: nilaiEksak ? (tandaSin === '+' ? nilaiEksak.sin : nilaiEksak.sin === '0' ? '0' : `-${nilaiEksak.sin}`) : null,
        tanda: tandaSin
      },
      cos: {
        desimal: cosVal.toFixed(4),
        eksak: nilaiEksak ? (tandaCos === '+' ? nilaiEksak.cos : nilaiEksak.cos === '0' ? '0' : `-${nilaiEksak.cos}`) : null,
        tanda: tandaCos
      },
      tan: {
        desimal: Math.abs(tanVal) > 1000 ? '∞' : tanVal.toFixed(4),
        eksak: nilaiEksak ? (tandaTan === '+' ? nilaiEksak.tan : nilaiEksak.tan === '0' ? '0' : `-${nilaiEksak.tan}`) : null,
        tanda: tandaTan
      }
    });
  };

  const reset = () => {
    setSudut('');
    setHasil(null);
  };

  const contohSoal = (sudutVal) => {
    setSudut(sudutVal.toString());
    setTimeout(() => {
      const event = { target: { value: sudutVal.toString() } };
      setSudut(sudutVal.toString());
    }, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <Circle className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Kalkulator Sin Cos Tan
              </h1>
              <p className="text-sm text-gray-600 mt-1">dengan Sistem K Otomatis (Mencari Titik Terdekat)</p>
            </div>
          </div>

          {/* Info Sistem K */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Sistem K - Kelipatan 90° Terdekat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4">
                <p className="font-bold text-gray-800 mb-2">K = 0 (Mendekati 0°)</p>
                <p className="text-xs text-gray-700 mb-1">Contoh: 30°, 40°</p>
                <p className="text-xs text-gray-600">Rumus: α atau (360° - α)</p>
              </div>
              <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4">
                <p className="font-bold text-green-800 mb-2">K = 1 (Mendekati 90°)</p>
                <p className="text-xs text-green-700 mb-1">Contoh: 60°, 120°</p>
                <p className="text-xs text-green-600">Rumus: (90° ± α)</p>
              </div>
              <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4">
                <p className="font-bold text-blue-800 mb-2">K = 2 (Mendekati 180°)</p>
                <p className="text-xs text-blue-700 mb-1">Contoh: 135°, 210°</p>
                <p className="text-xs text-blue-600">Rumus: (180° ± α)</p>
              </div>
              <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4">
                <p className="font-bold text-orange-800 mb-2">K = 3 (Mendekati 270°)</p>
                <p className="text-xs text-orange-700 mb-1">Contoh: 240°, 300°</p>
                <p className="text-xs text-orange-600">Rumus: (270° ± α)</p>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-3 border border-indigo-300">
              <p className="text-sm text-indigo-900">
                <strong>Cara Kerja:</strong> Sistem akan otomatis mencari kelipatan 90° yang paling dekat dengan sudut yang diinput (0°, 90°, 180°, 270°, atau 360°)
              </p>
            </div>
          </div>

          {/* Tabel Kuadran */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tanda di Setiap Kuadran</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4">
                <p className="font-bold text-green-800 mb-2">Kuadran I (0° - 90°)</p>
                <p className="text-sm text-green-700">Sin: <span className="font-bold">+</span></p>
                <p className="text-sm text-green-700">Cos: <span className="font-bold">+</span></p>
                <p className="text-sm text-green-700">Tan: <span className="font-bold">+</span></p>
              </div>
              <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4">
                <p className="font-bold text-blue-800 mb-2">Kuadran II (90° - 180°)</p>
                <p className="text-sm text-blue-700">Sin: <span className="font-bold">+</span></p>
                <p className="text-sm text-blue-700">Cos: <span className="font-bold">−</span></p>
                <p className="text-sm text-blue-700">Tan: <span className="font-bold">−</span></p>
              </div>
              <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4">
                <p className="font-bold text-orange-800 mb-2">Kuadran III (180° - 270°)</p>
                <p className="text-sm text-orange-700">Sin: <span className="font-bold">−</span></p>
                <p className="text-sm text-orange-700">Cos: <span className="font-bold">−</span></p>
                <p className="text-sm text-orange-700">Tan: <span className="font-bold">+</span></p>
              </div>
              <div className="bg-purple-100 border-2 border-purple-400 rounded-lg p-4">
                <p className="font-bold text-purple-800 mb-2">Kuadran IV (270° - 360°)</p>
                <p className="text-sm text-purple-700">Sin: <span className="font-bold">−</span></p>
                <p className="text-sm text-purple-700">Cos: <span className="font-bold">+</span></p>
                <p className="text-sm text-purple-700">Tan: <span className="font-bold">−</span></p>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Input Sudut
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sudut (derajat) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={sudut}
                onChange={(e) => setSudut(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                placeholder="Contoh: 30, 135, 210, 315"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={hitungNilaiTrigonometri}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Hitung
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Contoh Soal Cepat */}
          <div className="bg-yellow-50 rounded-xl p-4 mb-6">
            <p className="font-semibold text-gray-800 mb-3">📝 Contoh Soal Cepat:</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setSudut('30'); setTimeout(hitungNilaiTrigonometri, 50); }} className="px-4 py-2 bg-white border-2 border-yellow-300 rounded-lg hover:bg-yellow-100 text-sm font-medium">
                30° (dekat 0°)
              </button>
              <button onClick={() => { setSudut('60'); setTimeout(hitungNilaiTrigonometri, 50); }} className="px-4 py-2 bg-white border-2 border-yellow-300 rounded-lg hover:bg-yellow-100 text-sm font-medium">
                60° (dekat 90°)
              </button>
              <button onClick={() => { setSudut('135'); setTimeout(hitungNilaiTrigonometri, 50); }} className="px-4 py-2 bg-white border-2 border-yellow-300 rounded-lg hover:bg-yellow-100 text-sm font-medium">
                135° (dekat 180°)
              </button>
              <button onClick={() => { setSudut('210'); setTimeout(hitungNilaiTrigonometri, 50); }} className="px-4 py-2 bg-white border-2 border-yellow-300 rounded-lg hover:bg-yellow-100 text-sm font-medium">
                210° (dekat 180°)
              </button>
              <button onClick={() => { setSudut('240'); setTimeout(hitungNilaiTrigonometri, 50); }} className="px-4 py-2 bg-white border-2 border-yellow-300 rounded-lg hover:bg-yellow-100 text-sm font-medium">
                240° (dekat 270°)
              </button>
              <button onClick={() => { setSudut('315'); setTimeout(hitungNilaiTrigonometri, 50); }} className="px-4 py-2 bg-white border-2 border-yellow-300 rounded-lg hover:bg-yellow-100 text-sm font-medium">
                315° (dekat 270°)
              </button>
              <button onClick={() => { setSudut('350'); setTimeout(hitungNilaiTrigonometri, 50); }} className="px-4 py-2 bg-white border-2 border-yellow-300 rounded-lg hover:bg-yellow-100 text-sm font-medium">
                350° (dekat 360°)
              </button>
            </div>
          </div>

          {/* Hasil */}
          {hasil && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
              <h3 className="text-2xl font-bold text-green-800 mb-4">📊 Hasil Perhitungan</h3>
              
              {/* Info Sudut */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-sm text-gray-600">Sudut:</p>
                  <p className="text-2xl font-bold text-indigo-600">{hasil.sudutAsli}°</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-sm text-gray-600">Terdekat ke:</p>
                  <p className="text-2xl font-bold text-orange-600">{hasil.closestPoint}°</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-sm text-gray-600">Nilai K:</p>
                  <p className="text-2xl font-bold text-purple-600">K = {hasil.kValue}</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-sm text-gray-600">Sudut Referensi:</p>
                  <p className="text-2xl font-bold text-teal-600">{hasil.sudutReferensi}°</p>
                </div>
              </div>

              {/* Rumus Penguraian */}
              <div className="bg-blue-100 rounded-lg p-4 mb-6 border border-blue-300">
                <p className="font-semibold text-blue-900 mb-2">🔍 Penguraian Sudut:</p>
                <p className="text-blue-800 text-lg font-medium">
                  {hasil.sudutAsli}° = {hasil.rumusSudut}
                </p>
                <p className="text-blue-700 text-sm mt-2">
                  Kuadran {hasil.kuadran} | Mendekati {hasil.closestPoint}° | Sudut referensi α = {hasil.sudutReferensi}°
                </p>
              </div>

              {/* Nilai Trigonometri */}
              <div className="space-y-4">
                {/* SIN */}
                <div className="bg-white rounded-lg p-5 shadow-md border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600">sin {hasil.sudutAsli}° = sin {hasil.rumusSudut}</p>
                      <p className="text-lg font-semibold text-blue-700 mt-1">
                        = {hasil.sin.tanda} sin {hasil.sudutReferensi}°
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${hasil.sin.tanda === '+' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {hasil.sin.tanda === '+' ? 'Positif' : 'Negatif'}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded p-3">
                    {hasil.sin.eksak && (
                      <p className="text-2xl font-bold text-blue-900">
                        = {hasil.sin.eksak}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mt-1">≈ {hasil.sin.desimal}</p>
                  </div>
                </div>

                {/* COS */}
                <div className="bg-white rounded-lg p-5 shadow-md border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600">cos {hasil.sudutAsli}° = cos {hasil.rumusSudut}</p>
                      <p className="text-lg font-semibold text-green-700 mt-1">
                        = {hasil.cos.tanda} cos {hasil.sudutReferensi}°
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${hasil.cos.tanda === '+' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {hasil.cos.tanda === '+' ? 'Positif' : 'Negatif'}
                    </span>
                  </div>
                  <div className="bg-green-50 rounded p-3">
                    {hasil.cos.eksak && (
                      <p className="text-2xl font-bold text-green-900">
                        = {hasil.cos.eksak}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mt-1">≈ {hasil.cos.desimal}</p>
                  </div>
                </div>

                {/* TAN */}
                <div className="bg-white rounded-lg p-5 shadow-md border-l-4 border-purple-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600">tan {hasil.sudutAsli}° = tan {hasil.rumusSudut}</p>
                      <p className="text-lg font-semibold text-purple-700 mt-1">
                        = {hasil.tan.tanda} tan {hasil.sudutReferensi}°
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${hasil.tan.tanda === '+' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {hasil.tan.tanda === '+' ? 'Positif' : 'Negatif'}
                    </span>
                  </div>
                  <div className="bg-purple-50 rounded p-3">
                    {hasil.tan.eksak && (
                      <p className="text-2xl font-bold text-purple-900">
                        = {hasil.tan.eksak}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mt-1">≈ {hasil.tan.desimal}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Referensi */}
          <div className="mt-6 bg-gray-50 rounded-lg p-5">
            <p className="font-semibold text-gray-800 mb-3">📚 Tabel Nilai Spesial:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Sudut</th>
                    <th className="p-2 border">0°</th>
                    <th className="p-2 border">30°</th>
                    <th className="p-2 border">45°</th>
                    <th className="p-2 border">60°</th>
                    <th className="p-2 border">90°</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr>
                    <td className="p-2 border font-semibold">sin</td>
                    <td className="p-2 border">0</td>
                    <td className="p-2 border">1/2</td>
                    <td className="p-2 border">(1/2)√2</td>
                    <td className="p-2 border">(1/2)√3</td>
                    <td className="p-2 border">1</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">cos</td>
                    <td className="p-2 border">1</td>
                    <td className="p-2 border">(1/2)√3</td>
                    <td className="p-2 border">(1/2)√2</td>
                    <td className="p-2 border">1/2</td>
                    <td className="p-2 border">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-semibold">tan</td>
                    <td className="p-2 border">0</td>
                    <td className="p-2 border">(1/3)√3</td>
                    <td className="p-2 border">1</td>
                    <td className="p-2 border">√3</td>
                    <td className="p-2 border">∞</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer - Created By */}
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-4 inline-block">
              <p className="text-gray-700 font-semibold">
                Created by <span className="text-indigo-600 font-bold">Fakhri Maulana Januar</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}