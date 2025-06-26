/**
 * イラスト生成テンプレートシステム (JavaScript版)
 * YAMLファイルから移行したインメモリ処理システム
 */

class IllustrationStyleGuide {
    constructor() {
        // 基本スタイル設定（元YAML: style, compositionセクション）
        this.baseStyle = {
            style: {
                lineArt: {
                    lineWeight: "uniform(thin)",
                    lineTexture: "very smooth",
                    outlineEmphasis: true,
                    fill: "selective_black"
                },
                color: {
                    palette: "monochrome",
                    useOfColor: "black_and_white_only",
                    shading: "none",
                    highlighting: "none"
                },
                rendering: {
                    detailLevel: "minimal",
                    textureUse: "none",
                    lighting: "none"
                },
                composition: {
                    background: "plain_white",
                    focus: "group_composition",
                    perspective: "flat"
                },
                influence: {
                    styleOrigin: ["graphic_design", "flat_illustration", "editorial_cartoon"],
                    notableTraits: ["uniform_line", "no_shadow", "no_gradient", "symbolic_shapes", "monochrome_design"]
                }
            },
            composition: {
                canvasShape: "square",
                subjectPosition: "centered",
                framing: "bust_up",
                background: "plain_white",
                perspective: "flat",
                focus: "single_character"
            }
        };

        // キャラクター固定値（みん銀スタイルの特徴）
        this.fixedCharacterFeatures = {
            face: {
                direction: "three_quarter",
                nose: {
                    style: "protruding",
                    angle: "profile_view",
                    complexity: "minimal"
                },
                eye: "small_dot",
                eyebrows: "none",
                mouth: "none"
            },
            hair: {
                shape: "cloud_like"
            }
        };

        // 可変項目のスキーマ定義
        this.variableSchema = {
            silhouette: {
                bodyType: ["slim", "average", "large"],
                height: ["short", "medium", "tall"],
                pose: ["walking", "standing", "waving", "holding_item"]
            },
            face: {
                faceShape: ["round", "oval", "square", "long"],
                glasses: ["none", "round", "square", "thick_frame"],
                beard: {
                    style: ["none", "stubble", "mustache", "goatee", "full_beard"],
                    thickness: ["light", "medium", "thick"],
                    coverage: ["chin_only", "jawline", "full_face"]
                }
            },
            hair: {
                style: ["short", "bob", "long", "tied", "curly"],
                volume: ["flat", "medium", "voluminous"],
                bangs: ["none", "straight", "side", "full"]
            },
            clothing: {
                top: {
                    type: ["tshirt", "shirt", "blouse", "hoodie", "sweater"],
                    pattern: ["plain", "stripes", "dots", "logo_text"],
                    sleeve: ["short", "long", "none"]
                },
                bottom: {
                    type: ["jeans", "skirt", "trousers", "dress", "shorts"],
                    length: ["short", "medium", "long"]
                }
            },
            accessories: {
                hat: ["none", "cap", "beanie", "wide_brim"],
                bag: ["none", "shoulder", "tote", "backpack"],
                others: ["smartphone", "earphones", "watch"]
            }
        };
    }

    /**
     * 画像解析用のプロンプトを生成
     */
    generateAnalysisPrompt() {
        const schemaJson = JSON.stringify(this.variableSchema, null, 2);
        
        return `Analyze this image and describe the visible clothing, accessories, and general style elements for illustration purposes. Focus on:

1. Clothing items (shirts, pants, dresses, etc.)
2. Accessories (hats, bags, glasses, etc.)
3. Facial features including beard/mustache if visible
4. General body posture and positioning
5. Hair style and appearance
6. Overall silhouette and proportions

Available options for each category:
${schemaJson}

Please respond in JSON format with your analysis:
{
  "silhouette": {
    "bodyType": "slim/average/large",
    "height": "short/medium/tall", 
    "pose": "walking/standing/waving/holding_item"
  },
  "face": {
    "faceShape": "round/oval/square/long",
    "glasses": "none/round/square/thick_frame",
    "beard": {
      "style": "none/stubble/mustache/goatee/full_beard",
      "thickness": "light/medium/thick",
      "coverage": "chin_only/jawline/full_face"
    }
  },
  "hair": {
    "style": "short/bob/long/tied/curly",
    "volume": "flat/medium/voluminous",
    "bangs": "none/straight/side/full"
  },
  "clothing": {
    "top": {
      "type": "tshirt/shirt/blouse/hoodie/sweater",
      "pattern": "plain/stripes/dots/logo_text",
      "sleeve": "short/long/none"
    },
    "bottom": {
      "type": "jeans/skirt/trousers/dress/shorts",
      "length": "short/medium/long"
    }
  },
  "accessories": {
    "hat": "none/cap/beanie/wide_brim",
    "bag": "none/shoulder/tote/backpack",
    "others": ["smartphone", "earphones", "watch"]
  }
}

Focus on clothing and style analysis for creative illustration purposes. Respond only with the JSON object.`;
    }

    /**
     * 解析結果と固定特徴を統合
     */
    mergeFeatures(analyzedFeatures) {
        const mergedFeatures = {
            // 固定特徴を基本とする
            face: { ...this.fixedCharacterFeatures.face },
            hair: { ...this.fixedCharacterFeatures.hair },
            
            // 可変特徴を追加
            silhouette: analyzedFeatures.silhouette || {},
            clothing: analyzedFeatures.clothing || {},
            accessories: analyzedFeatures.accessories || {}
        };

        // face と hair の可変項目を追加（固定値は上書きしない）
        if (analyzedFeatures.face) {
            Object.keys(analyzedFeatures.face).forEach(key => {
                if (!this.fixedCharacterFeatures.face.hasOwnProperty(key)) {
                    mergedFeatures.face[key] = analyzedFeatures.face[key];
                }
            });
        }

        if (analyzedFeatures.hair) {
            Object.keys(analyzedFeatures.hair).forEach(key => {
                if (!this.fixedCharacterFeatures.hair.hasOwnProperty(key)) {
                    mergedFeatures.hair[key] = analyzedFeatures.hair[key];
                }
            });
        }

        return mergedFeatures;
    }

    /**
     * イラスト生成用のプロンプトを生成
     */
    generateIllustrationPrompt(features) {
        const mergedFeatures = this.mergeFeatures(features);
        
        // スタイルガイドの文字列化
        const styleDescription = this.createStyleDescription();
        const characterDescription = this.createCharacterDescription(mergedFeatures);
        
        return `Create an illustration based on the following detailed specifications:

STYLE SPECIFICATIONS:
${styleDescription}

CHARACTER SPECIFICATIONS:
${characterDescription}

INSTRUCTIONS:
- Follow the style specifications exactly for line art, color palette, and rendering
- Use the composition guidelines for framing, positioning, and background
- Implement all character features as specified
- Pay special attention to the fixed style elements (face direction, nose style, eye type, hair shape)
- Ensure the illustration matches the monochrome, line art aesthetic described

Focus on creating a clean, minimalist line art illustration with the exact characteristics specified.`;
    }

    /**
     * スタイル記述を生成
     */
    createStyleDescription() {
        const style = this.baseStyle.style;
        const composition = this.baseStyle.composition;
        
        return `Style: ${style.lineArt.lineWeight} line art with ${style.lineArt.lineTexture} texture, ${style.color.palette} ${style.color.useOfColor}, ${style.rendering.detailLevel} detail level, ${style.rendering.lighting} lighting.
Composition: ${composition.canvasShape} canvas, ${composition.subjectPosition} subject, ${composition.framing} framing, ${composition.background} background, ${composition.perspective} perspective.
Notable traits: ${style.influence.notableTraits.join(', ')}.`;
    }

    /**
     * キャラクター記述を生成
     */
    createCharacterDescription(features) {
        const parts = [];
        
        // Face features
        if (features.face) {
            const face = features.face;
            parts.push(`Face: ${face.direction} view, ${face.faceShape || 'default'} face shape, ${face.nose.style} nose (${face.nose.angle}), ${face.eye} eyes, ${face.eyebrows} eyebrows, ${face.mouth} mouth`);
            
            if (face.glasses && face.glasses !== 'none') {
                parts.push(`Glasses: ${face.glasses}`);
            }
            
            if (face.beard && face.beard.style !== 'none') {
                parts.push(`Beard: ${face.beard.style} style, ${face.beard.thickness} thickness, ${face.beard.coverage} coverage`);
            }
        }

        // Hair
        if (features.hair) {
            const hair = features.hair;
            parts.push(`Hair: ${hair.shape} shape, ${hair.style || 'default'} style, ${hair.volume || 'medium'} volume, ${hair.bangs || 'none'} bangs`);
        }

        // Silhouette
        if (features.silhouette) {
            const sil = features.silhouette;
            parts.push(`Silhouette: ${sil.bodyType || 'average'} body type, ${sil.height || 'medium'} height, ${sil.pose || 'standing'} pose`);
        }

        // Clothing
        if (features.clothing) {
            const clothing = features.clothing;
            if (clothing.top) {
                const top = clothing.top;
                parts.push(`Top: ${top.type || 'shirt'} with ${top.pattern || 'plain'} pattern, ${top.sleeve || 'short'} sleeves`);
            }
            if (clothing.bottom) {
                const bottom = clothing.bottom;
                parts.push(`Bottom: ${bottom.type || 'trousers'}, ${bottom.length || 'long'} length`);
            }
        }

        // Accessories
        if (features.accessories) {
            const acc = features.accessories;
            if (acc.hat && acc.hat !== 'none') {
                parts.push(`Hat: ${acc.hat}`);
            }
            if (acc.bag && acc.bag !== 'none') {
                parts.push(`Bag: ${acc.bag}`);
            }
            if (acc.others && acc.others.length > 0) {
                parts.push(`Other accessories: ${acc.others.join(', ')}`);
            }
        }

        return parts.join('\n');
    }

    /**
     * デフォルト特徴を取得（解析失敗時用）
     */
    getDefaultFeatures() {
        return {
            silhouette: {
                bodyType: "average",
                height: "medium",
                pose: "standing"
            },
            face: {
                faceShape: "oval",
                glasses: "none",
                beard: {
                    style: "none",
                    thickness: null,
                    coverage: null
                }
            },
            hair: {
                style: "short",
                volume: "medium",
                bangs: "none"
            },
            clothing: {
                top: {
                    type: "shirt",
                    pattern: "plain",
                    sleeve: "short"
                },
                bottom: {
                    type: "trousers",
                    length: "long"
                }
            },
            accessories: {
                hat: "none",
                bag: "none",
                others: []
            }
        };
    }
}

// エクスポート（ブラウザ環境では window オブジェクトに追加）
if (typeof window !== 'undefined') {
    window.IllustrationStyleGuide = IllustrationStyleGuide;
}

// Node.js環境での使用（テスト等）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IllustrationStyleGuide;
}