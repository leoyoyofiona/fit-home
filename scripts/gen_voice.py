#!/usr/bin/env python3
"""
Generate all voice clips for fit-home using edge-tts.
- Female voice: zh-CN-XiaoxiaoNeural (晓晓)
- Male voice:   zh-CN-YunxiNeural (云希)
- Rate: +0% (normal speed, was +5% which felt too rushed)
- Opposite-gender playback: male users hear female voice, female users hear male voice
"""
import subprocess
import os
import sys

EDGE_TTS = "/Users/leo/.workbuddy/binaries/python/versions/3.13.12/bin/edge-tts"
AUDIO_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "voice")

# Voice clip texts — conversational, motivational Chinese
CLIPS = {
    "start":            "嘿，准备好了吗？我们马上开始！",
    "jumping-jack":     "开合跳，三十下，跟上节奏，加油！",
    "squat":            "深蹲，十五下，蹲下去，站起来！",
    "pushup":           "俯卧撑，十二下，坚持住！",
    "crunch":           "卷腹，二十下，收紧腹部！",
    "plank":            "平板支撑，三十秒，稳住别动！",
    "russian-twist":    "俄罗斯转体，二十下，左右转！",
    "leg-raise":        "仰卧抬腿，十五下，慢慢放！",
    "lunge":            "弓步蹲，十六下，交替来！",
    "mountain-climber": "登山跑，三十下，加快速度！",
    "burpee":           "波比跳，十下，全力冲！",
    "mid-half":         "已经一半啦，加油，坚持！",
    "mid-final":        "最后几个了，拼一下，你可以的！",
    "rest":             "好的，这个动作做完了。来，跟着我放松一下。深呼吸，吸气，呼气。甩甩手，抖抖腿，让肌肉恢复一下。",
    "rest-next":        "来，休息一下。跟着我深呼吸，吸气，呼气。放松肩膀，转动脖子。喝口水，调整好呼吸，马上继续，加油！",
    "rest-ready":       "好了，准备继续。三，二，一！",
    "complete":         "太棒了，今天训练全部完成！你真的很厉害，给自己鼓个掌吧！",
}

VOICES = {
    "female": "zh-CN-XiaoxiaoNeural",  # 晓晓 (male users hear this)
    "male":   "zh-CN-YunxiNeural",      # 云希 (female users hear this)
}

RATE = "+0%"  # Normal speed (was +5%, user said too rushed)

def generate():
    for gender, voice in VOICES.items():
        out_dir = os.path.join(AUDIO_DIR, gender)
        os.makedirs(out_dir, exist_ok=True)
        for key, text in CLIPS.items():
            out_path = os.path.join(out_dir, f"{key}.mp3")
            cmd = [
                EDGE_TTS,
                "--voice", voice,
                "--rate", RATE,
                "--text", text,
                "--write-media", out_path,
            ]
            print(f"  [{gender}] {key}.mp3 ...", end=" ", flush=True)
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                size = os.path.getsize(out_path)
                print(f"OK ({size} bytes)")
            else:
                print(f"FAILED: {result.stderr[:100]}")
                sys.exit(1)
    print("\nAll voice clips generated successfully!")

if __name__ == "__main__":
    print(f"Generating {len(CLIPS)} clips x {len(VOICES)} voices = {len(CLIPS)*len(VOICES)} files")
    print(f"Rate: {RATE} (normal speed)")
    generate()
