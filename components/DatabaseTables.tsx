
import React, { useState } from 'react';

const Table: React.FC<{ title: string; headers: string[]; data: (string|number)[][]; id:string }> = ({ title, headers, data, id }) => (
    <div className="mb-4">
        <h4 className="font-bold text-lg text-cyan-400 mb-2">{id} ({title})</h4>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-200 uppercase bg-slate-700">
                    <tr>
                        {headers.map(h => <th key={h} className="py-2 px-3">{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} className="bg-slate-800 border-b border-slate-700">
                            {row.map((cell, j) => <td key={j} className="py-2 px-3">{cell}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


const DatabaseTables: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const animalData = {
        headers: ['id_hewan', 'nama_hewan', 'spesies', 'id_kandang'],
        data: [
            [101, 'Simba', 'Singa', 1], [102, 'Nala', 'Singa', 1], [103, 'Rio', 'Burung Macaw', 2],
            [104, 'Koko', 'Burung Kakaktua', 2], [105, 'Rango', 'Iguana', 3], [106, 'Dumbo', 'Gajah', 4],
            [107, 'Taro', 'Penyu', 3]
        ]
    };
    const employeeData = {
        headers: ['id_pegawai', 'nama_pegawai', 'jabatan'],
        data: [
            [201, 'Budi', 'Perawat Hewan'], [202, 'Siti', 'Dokter Hewan'], [203, 'Andi', 'Perawat Hewan'],
            [204, 'Rina', 'Petugas Kebersihan'], [205, 'Dewi', 'Dokter Hewan']
        ]
    };
    const cageData = {
        headers: ['id_kandang', 'nama_kandang', 'lokasi'],
        data: [
            [1, 'Kandang Singa', 'Utara'], [2, 'Kandang Burung', 'Timur'], [3, 'Kandang Reptil', 'Barat'],
            [4, 'Kandang Gajah', 'Selatan']
        ]
    };
    const treatmentData = {
        headers: ['id_perawatan', 'id_hewan', 'id_pegawai', 'tgl_perawatan', 'keterangan'],
        data: [
            [301, 101, 201, '2025-01-10', 'Pemeriksaan rutin'], [302, 101, 202, '2025-01-15', 'Pemberian vaksin'],
            [303, 102, 201, '2025-01-12', 'Pemeriksaan kesehatan'], [304, 103, 202, '2025-01-20', 'Pemeriksaan sayap'],
            [305, 104, 201, '2025-01-22', 'Pemeriksaan rutin'], [306, 105, 203, '2025-01-25', 'Pemeriksaan kulit'],
            [307, 105, 202, '2025-01-28', 'Pengobatan infeksi'], [308, 106, 203, '2025-01-30', 'Pemeriksaan gading'],
            [309, 101, 203, '2025-02-01', 'Perawatan gigi'], [310, 104, 205, '2025-02-02', 'Pemeriksaan kesehatan']
        ]
    };

    return (
        <div>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left font-semibold text-lg p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors flex justify-between items-center"
            >
                <span>View Database Tables</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-down">
                    <Table title="Animal" id="Tabel Hewan" {...animalData} />
                    <Table title="Employee" id="Tabel Pegawai" {...employeeData} />
                    <Table title="Cage" id="Tabel Kandang" {...cageData} />
                    <Table title="Treatment" id="Tabel Perawatan" {...treatmentData} />
                </div>
            )}
        </div>
    );
};

export default DatabaseTables;
