import React, { useState } from 'react';
import { FileCheck, Plus, Filter, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import { Evidence, CompetencyEvaluation } from '../types';

interface EvidencePageProps {
  evidenceList: Evidence[];
  competencies: CompetencyEvaluation[];
  onAddEvidence: (newEv: Partial<Evidence>) => Promise<void>;
  onOpenTrace: (competencyId: string) => void;
}

export const EvidencePage: React.FC<EvidencePageProps> = ({
  evidenceList,
  competencies,
  onAddEvidence,
  onOpenTrace
}) => {
  const [selectedCompFilter, setSelectedCompFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompId, setNewCompId] = useState(competencies[0]?.competency.id || 'comp-rest-api');
  const [newType, setNewType] = useState<'practical' | 'project' | 'theory' | 'reflection'>('practical');
  const [newScore, setNewScore] = useState(85);
  const [newSource, setNewSource] = useState('Hands-on Verification Lab');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredEvidence = selectedCompFilter === 'all'
    ? evidenceList
    : evidenceList.filter((e) => e.competencyId === selectedCompFilter);

  const getCompetencyName = (id: string) => {
    const found = competencies.find((c) => c.competency.id === id);
    return found ? found.competency.name : id;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setIsSubmitting(true);
    try {
      await onAddEvidence({
        competencyId: newCompId,
        title: newTitle,
        type: newType,
        score: Number(newScore),
        source: newSource,
        description: newDesc,
        relevance: 'High'
      });
      setIsAddModalOpen(false);
      setNewTitle('');
      setNewDesc('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            Evidence Ledger
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Verified Evidence Records</h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Each evidence artifact contributes directly to competency scoring through deterministic weight attribution. No synthetic or hardcoded score assumptions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Evidence Artifact</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 text-slate-400 shrink-0" />
        <span className="text-xs font-semibold text-slate-500 mr-2">Filter Competency:</span>
        <button
          onClick={() => setSelectedCompFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            selectedCompFilter === 'all'
              ? 'bg-slate-900 text-white font-semibold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All ({evidenceList.length})
        </button>
        {competencies.map((comp) => (
          <button
            key={comp.competency.id}
            onClick={() => setSelectedCompFilter(comp.competency.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedCompFilter === comp.competency.id
                ? 'bg-sky-600 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {comp.competency.name}
          </button>
        ))}
      </div>

      {/* Evidence Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Evidence Artifact</th>
                <th className="py-3 px-4">Competency</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Source / Origin</th>
                <th className="py-3 px-4 text-center">Relevance</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEvidence.map((ev) => {
                return (
                  <tr key={ev.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <FileCheck className="h-4 w-4 text-sky-600 shrink-0" />
                        <span>{ev.title}</span>
                      </div>
                      {ev.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{ev.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {getCompetencyName(ev.competencyId)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ev.type === 'practical'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ev.type === 'project'
                          ? 'bg-amber-100 text-amber-800'
                          : ev.type === 'theory'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {ev.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-sm font-extrabold ${
                        ev.score >= 70
                          ? 'text-emerald-700'
                          : ev.score >= 50
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}>
                        {ev.score}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 flex items-center gap-1 mt-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{ev.date}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span>{ev.source}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        {ev.relevance}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenTrace(ev.competencyId)}
                        className="text-sky-600 hover:text-sky-800 font-semibold inline-flex items-center gap-1 hover:underline"
                        title="Inspect how this evidence impacts the competency score"
                      >
                        <span>Trace</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Evidence Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Verified Evidence Artifact</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a new assessment or project artifact to automatically recalculate competency scores.
            </p>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Competency Target</label>
                <select
                  value={newCompId}
                  onChange={(e) => setNewCompId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-sky-500"
                >
                  {competencies.map((comp) => (
                    <option key={comp.competency.id} value={comp.competency.id}>
                      {comp.competency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Artifact Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End-to-End API Integration Milestone"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Evidence Category</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-sky-500"
                  >
                    <option value="practical">Practical Assessment (40%)</option>
                    <option value="project">Project Evidence (30%)</option>
                    <option value="theory">Concept/Theory (20%)</option>
                    <option value="reflection">Reflection (10%)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Score Obtained (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-sky-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Source / Verification Origin</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details regarding test suites, code reviews, or lab execution..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Add Evidence & Recalculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
