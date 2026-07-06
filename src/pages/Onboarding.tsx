import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { Gender } from '../types'
import Layout from '../components/Layout'

// 身体数据录入页
export default function Onboarding() {
  const navigate = useNavigate()
  const setProfile = useStore((s) => s.setProfile)
  const existing = useStore((s) => s.profile)

  const [name, setName] = useState(existing?.name ?? '')
  const [height, setHeight] = useState(existing?.height ?? 170)
  const [weight, setWeight] = useState(existing?.weight ?? 65)
  const [gender, setGender] = useState<Gender>(existing?.gender ?? 'male')
  const [age, setAge] = useState(existing?.age ?? 25)

  const submit = () => {
    setProfile({ name: name.trim() || '健身达人', height, weight, gender, age })
    navigate('/goals')
  }

  return (
    <Layout showNav={false}>
      <div className="pt-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏃</div>
          <h1 className="text-2xl font-bold text-slate-800">居家无器械健身</h1>
          <p className="text-sm text-slate-500 mt-2">每天5-10分钟，随时随地开练</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5">
          <h2 className="text-base font-semibold text-slate-700">先填一下你的基础数据</h2>

          {/* 昵称 —— 排行榜显示用 */}
          <div>
            <span className="text-sm text-slate-600 mb-1.5 block">昵称</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入你的昵称（排行榜显示用）"
              maxLength={12}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-400 focus:bg-white transition"
            />
          </div>

          <Field label="身高">
            <Stepper value={height} setValue={setHeight} min={100} max={250} unit="cm" />
          </Field>

          <Field label="体重">
            <Stepper value={weight} setValue={setWeight} min={30} max={200} unit="kg" />
          </Field>

          <Field label="性别">
            <div className="flex gap-2">
              <Choice active={gender === 'male'} onClick={() => setGender('male')}>男</Choice>
              <Choice active={gender === 'female'} onClick={() => setGender('female')}>女</Choice>
            </div>
          </Field>

          <Field label="年龄">
            <Stepper value={age} setValue={setAge} min={10} max={100} unit="岁" />
          </Field>
        </div>

        <button
          onClick={submit}
          className="w-full mt-6 h-12 rounded-xl bg-brand-500 text-white font-semibold text-base active:scale-[0.98] transition shadow-sm shadow-brand-500/30"
        >
          下一步：选择目标
        </button>
        <p className="text-center text-xs text-slate-400 mt-3">数据仅保存在本机，不会上传</p>
      </div>
    </Layout>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600">{label}</span>
      {children}
    </div>
  )
}

function Stepper({ value, setValue, min, max, unit }: { value: number; setValue: (n: number) => void; min: number; max: number; unit: string }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => setValue(Math.max(min, value - 1))} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold active:scale-90">−</button>
      <span className="w-16 text-center font-semibold text-slate-800 tabular-nums">{value}{unit}</span>
      <button onClick={() => setValue(Math.min(max, value + 1))} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold active:scale-90">+</button>
    </div>
  )
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 h-9 rounded-lg font-medium text-sm transition ${active ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'}`}
    >
      {children}
    </button>
  )
}
