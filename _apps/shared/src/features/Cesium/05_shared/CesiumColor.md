# 🎨 Cesium Color 상수 정리

Cesium에서 제공하는 `Cesium.Color` 클래스는 다양한 색상 상수를 제공합니다. 아래는 대표적인 색상 상수와 한글 설명입니다.

## ✅ 기본 색상

| 상수 | 설명 | 색상 코드 |
|------|------|------------|
| `Color.RED` | 빨강 | `#FF0000` |
| `Color.GREEN` | 초록 | `#008000` |
| `Color.BLUE` | 파랑 | `#0000FF` |
| `Color.BLACK` | 검정 | `#000000` |
| `Color.WHITE` | 흰색 | `#FFFFFF` |
| `Color.YELLOW` | 노랑 | `#FFFF00` |
| `Color.CYAN` | 청록색 | `#00FFFF` |
| `Color.MAGENTA` / `FUCHSIA` | 자홍 (핑크 계열) | `#FF00FF` |
| `Color.GRAY` | 회색 | `#808080` |

## 🌈 밝은 색 계열

| 상수 | 설명 | 색상 코드 |
|------|------|------------|
| `Color.LIGHTBLUE` | 연한 파란색 | `#ADD8E6` |
| `Color.LIGHTGREEN` | 연한 초록색 | `#90EE90` |
| `Color.LIGHTPINK` | 연한 분홍색 | `#FFB6C1` |
| `Color.LIGHTGRAY` / `LIGHTGREY` | 밝은 회색 | `#D3D3D3` |
| `Color.LIGHTYELLOW` | 연한 노란색 | `#FFFFE0` |

## 🏞 자연 색 계열

| 상수 | 설명 | 색상 코드 |
|------|------|------------|
| `Color.BEIGE` | 베이지 | `#F5F5DC` |
| `Color.KHAKI` | 카키 | `#F0E68C` |
| `Color.TAN` | 담황색 | `#D2B48C` |
| `Color.SIENNA` | 연한 갈색 | `#A0522D` |
| `Color.SADDLEBROWN` | 짙은 갈색 | `#8B4513` |
| `Color.OLIVE` | 올리브색 | `#808000` |
| `Color.NAVAJOWHITE` | 밝은 살구색 | `#FFDEAD` |

## 🌌 어두운 색 계열

| 상수 | 설명 | 색상 코드 |
|------|------|------------|
| `Color.DARKBLUE` | 진한 파랑 | `#00008B` |
| `Color.DARKRED` | 진한 빨강 | `#8B0000` |
| `Color.DARKGREEN` | 진한 초록 | `#006400` |
| `Color.DARKGRAY` / `DARKGREY` | 진한 회색 | `#A9A9A9` |
| `Color.DIMGRAY` / `DIMGREY` | 어두운 회색 | `#696969` |
| `Color.MIDNIGHTBLUE` | 자정 파랑 | `#191970` |

## 🍊 기타 색상

| 상수 | 설명 | 색상 코드 |
|------|------|------------|
| `Color.ORANGE` | 주황 | `#FFA500` |
| `Color.ORANGERED` | 주황빛 빨강 | `#FF4500` |
| `Color.GOLD` | 금색 | `#FFD700` |
| `Color.SKYBLUE` | 하늘색 | `#87CEEB` |
| `Color.INDIGO` | 남색 | `#4B0082` |
| `Color.VIOLET` | 보라 | `#EE82EE` |
| `Color.HOTPINK` | 강한 핑크 | `#FF69B4` |
| `Color.SPRINGGREEN` | 봄의 초록 | `#00FF7F` |

## 🧼 투명 색상

| 상수 | 설명 | 색상 코드 |
|------|------|------------|
| `Color.TRANSPARENT` | 완전히 투명 | `rgba(0, 0, 0, 0)` |

---

## 💡 활용 팁

```ts
// CSS 문자열로 생성
Cesium.Color.fromCssColorString("skyblue");

// 투명도 조절
Cesium.Color.RED.withAlpha(0.5);

// 랜덤 색상
Cesium.Color.fromRandom();
```